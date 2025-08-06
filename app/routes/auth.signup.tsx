import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  Container,
  Paper,
  Title,
  Text,
  TextInput,
  PasswordInput,
  Button,
  Group,
  Stack,
  Divider,
  Alert,
  Box,
  Avatar,
  Center,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconUserPlus, IconLock, IconMail, IconUser, IconAlertCircle } from '@tabler/icons-react';
import { createUser } from '../lib/database';

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'volunteer' as 'volunteer' | 'manager',
    },
    validate: {
      name: (value) => (value.length < 2 ? 'Name must be at least 2 characters' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 6 ? 'Password must be at least 6 characters' : null),
      confirmPassword: (value, values) =>
        value !== values.password ? 'Passwords do not match' : null,
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    setError('');

    try {
      const result = await createUser({
        name: values.name,
        email: values.email,
        password_hash: values.password, // In a real app, this would be hashed
        role: values.role,
      });

      // If we get here, the user was created successfully
      notifications.show({
        title: 'Account Created!',
        message: 'Your account has been successfully created. Please sign in.',
        color: 'green',
      });
      navigate('/auth/login');
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={40}>
      <Center mb="md">
        <Avatar size={80} color="orange" radius={80}>
          <IconUserPlus size={40} />
        </Avatar>
      </Center>

      <Title ta="center" fw={900}>
        Create your account
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Join the Kenton County Animal Shelter volunteer team
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
              label="Full Name"
              placeholder="John Doe"
              leftSection={<IconUser size={16} />}
              required
              {...form.getInputProps('name')}
            />

            <TextInput
              label="Email"
              placeholder="you@example.com"
              leftSection={<IconMail size={16} />}
              required
              {...form.getInputProps('email')}
            />

            <PasswordInput
              label="Password"
              placeholder="Your password"
              leftSection={<IconLock size={16} />}
              required
              {...form.getInputProps('password')}
            />

            <PasswordInput
              label="Confirm Password"
              placeholder="Confirm your password"
              leftSection={<IconLock size={16} />}
              required
              {...form.getInputProps('confirmPassword')}
            />

            <Button
              type="submit"
              loading={loading}
              fullWidth
              size="md"
              leftSection={<IconUserPlus size={16} />}
            >
              Create Account
            </Button>
          </Stack>
        </form>

        <Divider my="md" label="or" labelPosition="center" />

        <Group justify="center" mt="md">
          <Text size="sm" c="dimmed">
            Already have an account?{' '}
            <Link to="/auth/login" style={{ color: 'var(--mantine-color-orange-6)', textDecoration: 'none' }}>
              Sign in
            </Link>
          </Text>
        </Group>
      </Paper>

      <Box mt="xl" ta="center">
        <Text size="sm" c="dimmed">
          By creating an account, you agree to our{' '}
          <Text component="span" c="orange.6" style={{ cursor: 'pointer' }}>
            Terms of Service
          </Text>{' '}
          and{' '}
          <Text component="span" c="orange.6" style={{ cursor: 'pointer' }}>
            Privacy Policy
          </Text>
        </Text>
      </Box>
    </Container>
  );
}
