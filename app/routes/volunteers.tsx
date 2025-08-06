import { useEffect, useState } from "react";
import { getUsers, updateUser } from "~/lib/database";
import { useForm } from '@mantine/form';
import {
  Container, Title, Text, Card, Group, Button, Badge, Stack,
  Grid, GridCol, Avatar, Paper, Box, LoadingOverlay,
  Alert, Select, TextInput, ActionIcon, useMantineTheme, Modal, Switch
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
  const [editingVolunteer, setEditingVolunteer] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Form for editing volunteer details
  const editVolunteerForm = useForm({
    initialValues: {
      name: '',
      email: '',
      role: 'volunteer' as 'volunteer' | 'manager',
      total_hours: 0,
      orientation_completed: false
    },
    validate: {
      name: (value) => value.trim().length === 0 ? 'Name is required' : null,
      email: (value) => !/^\S+@\S+$/.test(value) ? 'Invalid email' : null,
      role: (value) => !value ? 'Role is required' : null
    }
  });

  // Get current user from localStorage (same as other pages)
  const [currentUser, setCurrentUser] = useState<any>({
    user_id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Morgan Lewis',
    role: 'manager' as 'volunteer' | 'manager'
  });

  useEffect(() => {
    // Load current user from localStorage on client side
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
      } catch (err) {
        console.error('Error parsing stored user:', err);
      }
    }
  }, []);

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

  const handleEditVolunteer = async (values: any) => {
    try {
      console.log('Form values:', values); // Debug log
      console.log('Editing volunteer ID:', editingVolunteer.user_id); // Debug log
      
      const updateData = {
        name: values.name,
        email: values.email,
        role: values.role,
        total_hours: parseFloat(values.total_hours) || 0,
        orientation_completed: Boolean(values.orientation_completed)
      };
      
      console.log('Update data being sent:', updateData); // Debug log
      
      const updatedVolunteer = await updateUser(editingVolunteer.user_id, updateData);
      
      setVolunteers(volunteers.map(volunteer => 
        volunteer.user_id === editingVolunteer.user_id ? updatedVolunteer : volunteer
      ));
      
      setEditingVolunteer(null);
      setShowEditModal(false);
      editVolunteerForm.reset();
      
      notifications.show({
        title: 'Success',
        message: `${values.name}'s profile has been updated successfully`,
        color: 'green'
      });
    } catch (err) {
      console.error('Error updating volunteer:', err);
      console.error('Error details:', JSON.stringify(err, null, 2)); // Debug log
      
      let errorMessage = 'Failed to update volunteer profile';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'object' && err !== null) {
        errorMessage = JSON.stringify(err);
      }
      
      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red'
      });
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

        {/* Volunteers List */}
        <Card shadow="sm" padding="md" radius="md" withBorder>
          <Stack gap="xs">
            {filteredVolunteers.map((volunteer) => (
              <Group 
                key={volunteer.user_id} 
                justify="space-between" 
                p="sm" 
                style={{ 
                  border: '1px solid var(--mantine-color-gray-3)', 
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--mantine-color-gray-1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                onClick={() => {
                  setSelectedVolunteer(volunteer);
                  setShowDetailsModal(true);
                }}
              >
                <Group gap="sm">
                  <Avatar 
                    size="md" 
                    color={getRoleColor(volunteer.role)}
                    src={volunteer.profile_photo_url}
                  >
                    {volunteer.name.split(' ').map((n: string) => n[0]).join('')}
                  </Avatar>
                  <Box>
                    <Text fw={500} size="sm">{volunteer.name}</Text>
                    <Text size="xs" c="dimmed">{volunteer.email}</Text>
                  </Box>
                </Group>
                <Group gap="sm">
                  <Badge 
                    color={getRoleColor(volunteer.role)} 
                    variant="light"
                    size="sm"
                  >
                    {getRoleLabel(volunteer.role)}
                  </Badge>
                  <Text size="sm" c="dimmed">
                    {volunteer.total_hours || 0} hours
                  </Text>
                </Group>
              </Group>
            ))}
          </Stack>
        </Card>

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

        {/* Edit Volunteer Modal */}
        <Modal 
          opened={showEditModal} 
          onClose={() => {
            setShowEditModal(false);
            setEditingVolunteer(null);
            editVolunteerForm.reset();
          }} 
          title="Edit Volunteer Profile" 
          size="md"
        >
          <form onSubmit={editVolunteerForm.onSubmit(handleEditVolunteer)}>
            <Stack gap="md">
              <TextInput
                label="Full Name"
                placeholder="Enter full name"
                {...editVolunteerForm.getInputProps('name')}
                required
              />
              
              <TextInput
                label="Email Address"
                placeholder="Enter email address"
                {...editVolunteerForm.getInputProps('email')}
                required
              />
              
              <Select
                label="Role"
                data={[
                  { value: 'volunteer', label: 'Volunteer' },
                  { value: 'manager', label: 'Manager' }
                ]}
                {...editVolunteerForm.getInputProps('role')}
                required
              />
              
              <TextInput
                label="Total Hours"
                type="number"
                placeholder="Enter total hours"
                {...editVolunteerForm.getInputProps('total_hours')}
                min={0}
                step={0.5}
              />
              
              <Switch
                label="Orientation Completed"
                checked={editVolunteerForm.values.orientation_completed}
                onChange={(event) => editVolunteerForm.setFieldValue('orientation_completed', event.currentTarget.checked)}
                color="green"
              />
              
              <Group justify="flex-end">
                <Button 
                  variant="light" 
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingVolunteer(null);
                    editVolunteerForm.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Update Profile
                </Button>
              </Group>
            </Stack>
          </form>
                 </Modal>

        {/* Volunteer Details Modal */}
        <Modal 
          opened={showDetailsModal} 
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedVolunteer(null);
          }} 
          title="Volunteer Details" 
          size="md"
        >
          {selectedVolunteer && (
            <Stack gap="lg">
              {/* Header */}
              <Group gap="md">
                <Avatar 
                  size="xl" 
                  color={getRoleColor(selectedVolunteer.role)}
                  src={selectedVolunteer.profile_photo_url}
                >
                  {selectedVolunteer.name.split(' ').map((n: string) => n[0]).join('')}
                </Avatar>
                <Box>
                  <Title order={2} size="h3">{selectedVolunteer.name}</Title>
                  <Text size="sm" c="dimmed">{selectedVolunteer.email}</Text>
                  <Badge 
                    color={getRoleColor(selectedVolunteer.role)} 
                    variant="light"
                    size="sm"
                    mt="xs"
                  >
                    {getRoleLabel(selectedVolunteer.role)}
                  </Badge>
                </Box>
              </Group>

              {/* Stats */}
              <Paper p="md" withBorder radius="md">
                <Group gap="md" justify="center">
                  <Box ta="center">
                    <Text size="xl" fw={700} color={theme.colors.blue[6]}>
                      {selectedVolunteer.total_hours || 0}
                    </Text>
                    <Text size="sm" c="dimmed">Total Hours</Text>
                  </Box>
                </Group>
              </Paper>

              {/* Account Information */}
              <Box>
                <Title order={4} size="h5" mb="md">Account Information</Title>
                <Stack gap="md">
                  <Group gap="xs">
                    <IconMail size={16} color={theme.colors.gray[6]} />
                    <Text size="sm">{selectedVolunteer.email}</Text>
                  </Group>
                  <Group gap="xs">
                    <IconUser size={16} color={theme.colors.gray[6]} />
                    <Text size="sm">Member since: {new Date(selectedVolunteer.created_at).toLocaleDateString()}</Text>
                  </Group>
                  {selectedVolunteer.orientation_completed && (
                    <Badge variant="dot" size="sm" color="green">
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
                  leftSection={<IconEdit size={16} />}
                  onClick={() => {
                    setShowDetailsModal(false);
                    setEditingVolunteer(selectedVolunteer);
                    editVolunteerForm.setValues({
                      name: selectedVolunteer.name,
                      email: selectedVolunteer.email,
                      role: selectedVolunteer.role,
                      total_hours: selectedVolunteer.total_hours || 0,
                      orientation_completed: selectedVolunteer.orientation_completed || false
                    });
                    setShowEditModal(true);
                  }}
                >
                  Edit Profile
                </Button>
              </Group>
            </Stack>
          )}
        </Modal>
      </Container>
    </Box>
  );
} 