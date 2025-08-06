import { useEffect, useState } from "react";
import { getUsers } from "~/lib/database";
import {
  Container, Title, Text, Card, Group, Button, Badge, Stack,
  Grid, GridCol, Avatar, Paper, Box, LoadingOverlay,
  Alert, Select, TextInput, ActionIcon, useMantineTheme
} from '@mantine/core';
import {
  IconUsers, IconUser, IconClock, IconMail, IconPhone,
  IconAlertCircle, IconSearch, IconFilter, IconEdit
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

export function meta() {
  return [
    { title: "Volunteers - Kenton County Animal Shelter" },
    { name: "description", content: "Manage volunteers at Kenton County Animal Shelter." },
  ];
}

export default function Volunteers() {
  const theme = useMantineTheme();
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');

  // Mock current user (in real app, this would come from auth)
  const currentUser = {
    user_id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Morgan Lewis',
    role: 'manager' as 'volunteer' | 'manager'
  };

  useEffect(() => {
    loadVolunteers();
  }, []);

  async function loadVolunteers() {
    try {
      setLoading(true);
      const usersData = await getUsers();
      setVolunteers(usersData);
    } catch (err) {
      console.error('Error loading volunteers:', err);
      setError(err instanceof Error ? err.message : 'Failed to load volunteers');
    } finally {
      setLoading(false);
    }
  }

  // Filter and sort volunteers
  const getFilteredAndSortedVolunteers = () => {
    let filtered = volunteers.filter(volunteer => {
      // Search filter
      const matchesSearch = volunteer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           volunteer.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Role filter
      const matchesRole = roleFilter === 'all' || volunteer.role === roleFilter;
      
      return matchesSearch && matchesRole;
    });

    // Sort volunteers
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'hours':
          return (b.total_hours || 0) - (a.total_hours || 0);
        case 'role':
          return a.role.localeCompare(b.role);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'manager': return 'blue';
      case 'volunteer': return 'green';
      default: return 'gray';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'manager': return 'Manager';
      case 'volunteer': return 'Volunteer';
      default: return 'Unknown';
    }
  };

  if (currentUser.role !== 'manager') {
    return (
      <Container size="xl" py="xl">
        <Alert icon={<IconAlertCircle size={16} />} title="Access Denied" color="red">
          You do not have permission to view this page. Only managers can access the volunteers list.
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container size="xl" py="xl">
        <LoadingOverlay visible={true} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="xl" py="xl">
        <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
          {error}
        </Alert>
      </Container>
    );
  }

  const filteredVolunteers = getFilteredAndSortedVolunteers();

  return (
    <Box pos="relative" style={{ backgroundColor: theme.colors.background[0] }}>
      <Container size="xl" py="xl">
        {/* Header */}
        <Group justify="space-between" align="center" mb="xl">
          <Box>
            <Title order={1} size="h2" mb="xs">
              <Group gap="sm">
                <IconUsers size={32} color={theme.colors.orange[6]} />
                Volunteers
              </Group>
            </Title>
            <Text c="dimmed" size="sm">
              Manage and view all volunteers at the shelter
            </Text>
          </Box>
          <Badge size="lg" variant="light" color="orange">
            {filteredVolunteers.length} {filteredVolunteers.length === 1 ? 'Volunteer' : 'Volunteers'}
          </Badge>
        </Group>

        {/* Filters */}
        <Card shadow="sm" padding="md" radius="md" withBorder mb="lg">
          <Grid gutter="md">
            <GridCol span={{ base: 12, sm: 6, md: 4 }}>
              <TextInput
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.currentTarget.value)}
                leftSection={<IconSearch size={16} />}
                label="Search"
              />
            </GridCol>
            <GridCol span={{ base: 12, sm: 6, md: 3 }}>
              <Select
                label="Filter by Role"
                value={roleFilter}
                onChange={(value) => setRoleFilter(value || 'all')}
                data={[
                  { value: 'all', label: 'All Roles' },
                  { value: 'volunteer', label: 'Volunteers' },
                  { value: 'manager', label: 'Managers' }
                ]}
              />
            </GridCol>
            <GridCol span={{ base: 12, sm: 6, md: 3 }}>
              <Select
                label="Sort By"
                value={sortBy}
                onChange={(value) => setSortBy(value || 'name')}
                data={[
                  { value: 'name', label: 'Name' },
                  { value: 'hours', label: 'Total Hours' },
                  { value: 'role', label: 'Role' }
                ]}
              />
            </GridCol>
            <GridCol span={{ base: 12, sm: 6, md: 2 }}>
              <Button
                variant="light"
                color="red"
                size="sm"
                fullWidth
                style={{ marginTop: 28 }}
                onClick={() => {
                  setSearchTerm('');
                  setRoleFilter('all');
                  setSortBy('name');
                }}
              >
                Clear
              </Button>
            </GridCol>
          </Grid>
        </Card>

        {/* Volunteers Grid */}
        <Grid gutter="lg">
          {filteredVolunteers.map((volunteer) => (
            <GridCol key={volunteer.user_id} span={{ base: 12, sm: 6, lg: 4 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder style={{ height: '100%' }}>
                <Stack gap="md">
                  {/* Header */}
                  <Group justify="space-between" align="flex-start">
                    <Group gap="sm">
                      <Avatar 
                        size="lg" 
                        color={getRoleColor(volunteer.role)}
                        src={volunteer.profile_photo_url}
                      >
                        {volunteer.name.split(' ').map((n: string) => n[0]).join('')}
                      </Avatar>
                      <Box>
                        <Title order={3} size="h4">{volunteer.name}</Title>
                        <Text size="sm" c="dimmed">{volunteer.email}</Text>
                      </Box>
                    </Group>
                    <Badge 
                      color={getRoleColor(volunteer.role)} 
                      variant="light"
                      size="sm"
                    >
                      {getRoleLabel(volunteer.role)}
                    </Badge>
                  </Group>

                  {/* Stats */}
                  <Group gap="md">
                    <Paper p="xs" withBorder radius="md" style={{ flex: 1 }}>
                      <Group gap="xs" justify="center">
                        <IconClock size={16} color={theme.colors.blue[6]} />
                        <Box>
                          <Text size="lg" fw={600} ta="center">
                            {volunteer.total_hours || 0}
                          </Text>
                          <Text size="xs" c="dimmed" ta="center">Hours</Text>
                        </Box>
                      </Group>
                    </Paper>
                  </Group>

                  {/* Additional Info */}
                  <Box>
                    <Text size="sm" fw={500} mb="xs">Account Information</Text>
                    <Stack gap="xs">
                      <Group gap="xs">
                        <IconMail size={14} color={theme.colors.gray[6]} />
                        <Text size="sm">{volunteer.email}</Text>
                      </Group>
                      <Group gap="xs">
                        <IconUser size={14} color={theme.colors.gray[6]} />
                        <Text size="sm">Member since: {new Date(volunteer.created_at).toLocaleDateString()}</Text>
                      </Group>
                      {volunteer.orientation_completed && (
                        <Badge variant="dot" size="xs" color="green">
                          Orientation Completed
                        </Badge>
                      )}
                    </Stack>
                  </Box>

                  {/* Actions */}
                  <Group justify="flex-end">
                    <Button
                      variant="light"
                      color="blue"
                      size="sm"
                      leftSection={<IconEdit size={14} />}
                      onClick={() => {
                        // TODO: Implement edit volunteer functionality
                        notifications.show({
                          title: 'Coming Soon',
                          message: 'Edit volunteer functionality will be implemented soon',
                          color: 'blue'
                        });
                      }}
                    >
                      Edit Profile
                    </Button>
                  </Group>
                </Stack>
              </Card>
            </GridCol>
          ))}
        </Grid>

        {/* Empty State */}
        {filteredVolunteers.length === 0 && (
          <Card shadow="sm" padding="xl" radius="md" withBorder>
            <Box ta="center">
              <IconUsers size={48} color={theme.colors.gray[4]} />
              <Title order={3} size="h4" mt="md" mb="xs">No volunteers found</Title>
              <Text c="dimmed" size="sm">
                {searchTerm || roleFilter !== 'all' 
                  ? 'Try adjusting your search or filters to find volunteers.'
                  : 'No volunteers have been added to the system yet.'
                }
              </Text>
            </Box>
          </Card>
        )}
      </Container>
    </Box>
  );
} 