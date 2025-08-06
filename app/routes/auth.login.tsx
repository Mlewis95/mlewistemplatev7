import { useState } from "react";
import {
  Container, Title, Text, Card, Group, Button, Stack,
  TextInput, PasswordInput, Alert, Box, Paper, Avatar, Center, Divider
} from '@mantine/core';
import {
  IconUser, IconLock, IconAlertCircle, IconLogin
} from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { Link, useNavigate } from 'react-router';
import { authenticateUser } from '../lib/database';

export function meta() {
  return [
    { title: "Login - Kenton County Animal Shelter" },
    { name: "description", content: "Sign in to your Kenton County Animal Shelter account." },
  ];
}

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 6 ? 'Password must be at least 6 characters' : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    setError(null);

    try {
      const result = await authenticateUser(values.email, values.password);
      
      if (result.success && result.user) {
        notifications.show({
          title: 'Success',
          message: `Welcome back, ${result.user.name}!`,
          color: 'green'
        });
        
        // Store user data in localStorage or context for session management
        localStorage.setItem('currentUser', JSON.stringify({
          id: result.user.user_id,
          name: result.user.name,
          email: result.user.email,
          role: result.user.role
        }));
        
        // Redirect to dashboard
        navigate('/');
      } else {
        setError(result.error || 'Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };



  return (
    <Container size={420} my={40}>
      <Center mb="md">
        <Avatar size={80} color="orange" radius={80}>
          <IconLogin size={40} />
        </Avatar>
      </Center>

      <Title ta="center" fw={900}>
        Welcome Back
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Sign in to your Kenton County Animal Shelter account
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        {error && (
          <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red" mb="md">
            {error}
          </Alert>
        )}

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Email Address"
              placeholder="Enter your email"
              leftSection={<IconUser size={16} />}
              {...form.getInputProps('email')}
              required
            />

            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              leftSection={<IconLock size={16} />}
              {...form.getInputProps('password')}
              required
            />

            <Group justify="flex-end">
              <Link 
                to="/auth/forgot-password" 
                style={{ 
                  textDecoration: 'none',
                  color: 'var(--mantine-color-orange-6)',
                  fontSize: '14px'
                }}
              >
                Forgot password?
              </Link>
            </Group>

            <Button
              type="submit"
              loading={loading}
              fullWidth
              size="md"
              leftSection={<IconLogin size={16} />}
            >
              Sign In
            </Button>
          </Stack>
        </form>

        <Divider my="md" label="or" labelPosition="center" />

        <Group justify="center" mt="md">
          <Text size="sm" c="dimmed">
            Don't have an account?{' '}
            <Link 
              to="/auth/signup" 
              style={{ 
                textDecoration: 'none',
                color: 'var(--mantine-color-orange-6)',
                fontWeight: '600'
              }}
            >
              Sign up here
            </Link>
          </Text>
        </Group>
      </Paper>
    </Container>
  );
}
