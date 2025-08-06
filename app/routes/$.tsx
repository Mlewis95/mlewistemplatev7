import { Link } from 'react-router';
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Box,
  Center,
  Paper,
} from '@mantine/core';
import { IconHome, IconArrowLeft, IconAlertTriangle } from '@tabler/icons-react';

export function meta() {
  return [
    { title: "Page Not Found - Kenton County Animal Shelter" },
    { name: "description", content: "The page you're looking for doesn't exist." },
  ];
}

export default function NotFoundPage() {
  return (
    <Container size="md" my={40}>
      <Center>
        <Stack align="center" gap="xl">
          {/* 404 Icon */}
          <Box ta="center">
            <IconAlertTriangle size={120} color="var(--mantine-color-orange-6)" />
          </Box>

          {/* Main Content */}
          <Paper withBorder shadow="md" p={40} radius="md" style={{ maxWidth: '500px' }}>
            <Stack align="center" gap="lg">
              <Title order={1} ta="center" fw={900} size="h1">
                404
              </Title>
              
              <Title order={2} ta="center" fw={600} size="h3" c="dimmed">
                Page Not Found
              </Title>
              
              <Text ta="center" c="dimmed" size="lg">
                Sorry, the page you're looking for doesn't exist or has been moved.
              </Text>
              
              <Text ta="center" c="dimmed" size="sm">
                You might have typed the wrong address, or the page may have been moved to a new location.
              </Text>

              {/* Action Buttons */}
              <Group mt="xl" gap="md">
                <Button
                  leftSection={<IconArrowLeft size={16} />}
                  variant="outline"
                  onClick={() => window.history.back()}
                >
                  Go Back
                </Button>
                
                <Button
                  leftSection={<IconHome size={16} />}
                  component={Link}
                  to="/"
                >
                  Go Home
                </Button>
              </Group>
            </Stack>
          </Paper>

          {/* Additional Help */}
          <Box ta="center" c="dimmed" size="sm">
            <Text size="sm">
              Need help? Contact us at{' '}
              <Text component="span" c="orange.6" style={{ cursor: 'pointer' }}>
                support@kentoncountyanimalshelter.org
              </Text>
            </Text>
          </Box>
        </Stack>
      </Center>
    </Container>
  );
}
