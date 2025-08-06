import { useEffect, useState } from "react";
import type { Route } from "./+types/dog-walking";
import { getDogsForWalking, getDogWalks, createDogWalk } from "~/lib/database";
import {
  Container, Title, Text, Card, Group, Button, Badge, Stack,
  Grid, GridCol, Avatar, Paper, Modal, Box, TextInput, Textarea,
  Select, LoadingOverlay, Alert, ActionIcon, Divider, ThemeIcon,
  useMantineTheme
} from '@mantine/core';
import {
  IconDog, IconPlus, IconClock, IconCheck, IconAlertCircle,
  IconWalk, IconCalendar, IconClockHour4, IconNotes
} from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dog Walking - Kenton County Animal Shelter" },
    { name: "description", content: "Manage dog walking activities and track which dogs have been walked." },
  ];
}

export default function DogWalking() {
  const theme = useMantineTheme();
  const [dogs, setDogs] = useState<any[]>([]);
  const [dogWalks, setDogWalks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddWalk, setShowAddWalk] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unwalked' | 'walked'>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');

  // Get current user from localStorage
  const getCurrentUser = () => {
    try {
      const userData = localStorage.getItem('currentUser');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  };
  
  const currentUser = getCurrentUser();

  // Form for adding walks
  const walkForm = useForm({
    initialValues: {
      dog_id: '',
      walk_date: new Date().toISOString().split('T')[0], // Today's date
      start_time: '',
      duration: '30',
      notes: ''
    },
    validate: {
      dog_id: (value) => !value ? 'Please select a dog' : null,
      walk_date: (value) => !value ? 'Date is required' : null,
      start_time: (value) => !value ? 'Start time is required' : null
    }
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [dogsData, walksData] = await Promise.all([
        getDogsForWalking(),
        getDogWalks()
      ]);

      setDogs(dogsData);
      setDogWalks(walksData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  const handleSubmitWalk = async (values: any) => {
    try {
      if (!currentUser?.id) {
        notifications.show({
          title: 'Error',
          message: 'User not authenticated',
          color: 'red'
        });
        return;
      }

      const newWalk = await createDogWalk({
        user_id: currentUser.id,
        dog_id: values.dog_id,
        walk_date: values.walk_date,
        time_start: values.start_time,
        duration: values.duration,
        notes: values.notes
      });
      setDogWalks([newWalk, ...dogWalks]);
      setShowAddWalk(false);
      walkForm.reset();
      notifications.show({
        title: 'Success',
        message: 'Walk logged successfully',
        color: 'green'
      });
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: 'Failed to log walk',
        color: 'red'
      });
    }
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'green': return 'green';
      case 'yellow': return 'yellow';
      case 'blue': return 'blue';
      case 'red': return 'red';
      case 'black': return 'dark';
      default: return 'gray';
    }
  };

  const getWalkStatusForDog = (dogId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const todaysWalks = dogWalks.filter(walk => 
      walk.dog_id === dogId && walk.walk_date === today
    );
    return todaysWalks;
  };

  const getTodaysWalks = () => {
    const today = new Date().toISOString().split('T')[0];
    return dogWalks.filter(walk => walk.walk_date === today);
  };

  const getWalkedDogIds = () => {
    const today = new Date().toISOString().split('T')[0];
    const todaysWalks = dogWalks.filter(walk => walk.walk_date === today);
    return [...new Set(todaysWalks.map(walk => walk.dog_id))]; // Remove duplicates
  };

  if (loading) {
    return (
      <Container size="xl">
        <LoadingOverlay visible={true} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="xl">
        <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
          {error}
        </Alert>
      </Container>
    );
  }

  const todaysWalks = getTodaysWalks();
  const walkedDogIds = getWalkedDogIds();

  return (
    <Box pos="relative" style={{ backgroundColor: theme.colors.background[0] }}>
      <Container size="xl">
        <Grid gutter="md">
          {/* Left Sidebar - Summary & Actions */}
          <GridCol span={{ base: 12, lg: 3 }}>
            <Stack gap="md">
              {/* Today's Summary */}
              <Card shadow="sm" padding="md" radius="md" withBorder>
                <Group align="center" mb="sm">
                  <ThemeIcon size="md" variant="light" color="blue">
                    <IconCalendar size={16} />
                  </ThemeIcon>
                  <Box>
                    <Text fw={600} size="sm">Today's Summary</Text>
                    <Text size="xs" c="dimmed">
                      {new Date().toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </Text>
                  </Box>
                </Group>
                <Stack gap="sm">
                  <Paper 
                    p="sm" 
                    withBorder 
                    radius="md" 
                    ta="center"
                    style={{ 
                      cursor: 'pointer',
                      backgroundColor: activeFilter === 'unwalked' ? theme.colors.orange[0] : 'white',
                      borderColor: activeFilter === 'unwalked' ? theme.colors.orange[3] : undefined
                    }}
                    onClick={() => setActiveFilter('unwalked')}
                  >
                    <Text size="lg" fw={700} c="orange">{dogs.length - walkedDogIds.length}</Text>
                    <Text size="xs" c="dimmed">Need Walking</Text>
                  </Paper>
                  <Paper 
                    p="sm" 
                    withBorder 
                    radius="md" 
                    ta="center"
                    style={{ 
                      cursor: 'pointer',
                      backgroundColor: activeFilter === 'walked' ? theme.colors.green[0] : 'white',
                      borderColor: activeFilter === 'walked' ? theme.colors.green[3] : undefined
                    }}
                    onClick={() => setActiveFilter('walked')}
                  >
                    <Text size="lg" fw={700} c="green">{walkedDogIds.length}</Text>
                    <Text size="xs" c="dimmed">Completed</Text>
                  </Paper>
                  <Paper 
                    p="sm" 
                    withBorder 
                    radius="md" 
                    ta="center"
                    style={{ 
                      cursor: 'pointer',
                      backgroundColor: activeFilter === 'all' ? theme.colors.blue[0] : 'white',
                      borderColor: activeFilter === 'all' ? theme.colors.blue[3] : undefined
                    }}
                    onClick={() => setActiveFilter('all')}
                  >
                    <Text size="lg" fw={700} c="blue">{dogs.length}</Text>
                    <Text size="xs" c="dimmed">Total Available</Text>
                  </Paper>
                </Stack>
              </Card>

              {/* Quick Actions */}
              <Card shadow="sm" padding="md" radius="md" withBorder>
                <Text fw={600} size="sm" mb="sm">Quick Actions</Text>
                <Stack gap="xs">
                  <Button
                    leftSection={<IconPlus size={14} />}
                    variant="light"
                    size="sm"
                    onClick={() => setShowAddWalk(true)}
                    fullWidth
                  >
                    Log Walk
                  </Button>
                  {(activeFilter !== 'all' || levelFilter !== 'all') && (
                    <Button 
                      variant="light" 
                      size="sm" 
                      onClick={() => {
                        setActiveFilter('all');
                        setLevelFilter('all');
                      }}
                      leftSection={<IconDog size={14} />}
                      fullWidth
                    >
                      Show All Dogs
                    </Button>
                  )}
                </Stack>
              </Card>
            </Stack>
          </GridCol>

          {/* Main Content */}
          <GridCol span={{ base: 12, lg: 9 }}>
            <Stack gap="md">

              {/* Dogs Grid */}
              <Card shadow="sm" padding="md" radius="md" withBorder>
                <Group justify="space-between" align="center" mb="sm">
                  <Text fw={600} size="sm">
                    {activeFilter === 'all' && 'All Dogs'}
                    {activeFilter === 'unwalked' && 'Dogs Still Need Walking'}
                    {activeFilter === 'walked' && 'Dogs Already Walked'}
                  </Text>
                  <Select
                    placeholder="Filter by level"
                    value={levelFilter}
                    onChange={(value) => setLevelFilter(value || 'all')}
                    data={[
                      { value: 'all', label: 'All Levels' },
                      { value: 'green', label: 'Green Level' },
                      { value: 'yellow', label: 'Yellow Level' },
                      { value: 'blue', label: 'Blue Level' },
                      { value: 'red', label: 'Red Level' },
                      { value: 'black', label: 'Black Level' }
                    ]}
                    size="xs"
                    style={{ minWidth: '120px' }}
                  />
                </Group>
                <Grid gutter="md">
                  {dogs
                    .map((dog) => {
                      const todaysWalksForDog = getWalkStatusForDog(dog.pet_id);
                      const hasBeenWalked = todaysWalksForDog.length > 0;
                      const lastWalk = todaysWalksForDog[0];
                      return { ...dog, hasBeenWalked, lastWalk };
                    })
                    .filter((dog) => {
                      // Apply walk status filter
                      const walkStatusMatch = (() => {
                        switch (activeFilter) {
                          case 'unwalked':
                            return !dog.hasBeenWalked;
                          case 'walked':
                            return dog.hasBeenWalked;
                          default:
                            return true; // 'all' - show all dogs
                        }
                      })();

                      // Apply level filter
                      const levelMatch = levelFilter === 'all' || 
                        dog.training_level.toLowerCase() === levelFilter.toLowerCase();

                      return walkStatusMatch && levelMatch;
                    })
                    .sort((a, b) => {
                      // Sort unwalked dogs first, then walked dogs
                      if (a.hasBeenWalked && !b.hasBeenWalked) return 1;
                      if (!a.hasBeenWalked && b.hasBeenWalked) return -1;
                      return 0;
                    })
                    .map((dog) => (
                      <GridCol key={dog.pet_id} span={{ base: 12, sm: 6, lg: 4 }}>
                        <Paper p="sm" withBorder radius="md" style={{
                          borderColor: dog.hasBeenWalked ? theme.colors.green[3] : theme.colors.gray[3],
                          backgroundColor: dog.hasBeenWalked ? theme.colors.green[0] : 'white',
                          height: '200px',
                          display: 'flex',
                          flexDirection: 'column'
                        }}>
                          <Group justify="space-between" align="flex-start" mb="xs">
                            <Group gap="xs">
                              <Avatar size="sm" color={dog.hasBeenWalked ? "green" : "gray"}>
                                <IconDog size={14} />
                              </Avatar>
                              <Box>
                                <Text fw={600} size="sm">{dog.name}</Text>
                                <Badge 
                                  color={getLevelColor(dog.training_level)} 
                                  variant="light"
                                  size="xs"
                                >
                                  {dog.training_level} Level
                                </Badge>
                              </Box>
                            </Group>
                            {dog.hasBeenWalked && (
                              <ThemeIcon size="xs" color="green" variant="filled">
                                <IconCheck size={10} />
                              </ThemeIcon>
                            )}
                          </Group>

                          <Box style={{ flex: 1 }}>
                            {dog.hasBeenWalked ? (
                              <Stack gap="xs">
                                <Group gap="xs">
                                  <IconClockHour4 size={12} />
                                  <Text size="xs" c="dimmed">
                                    Walked at {dog.lastWalk.time_start}
                                  </Text>
                                </Group>
                                <Group gap="xs">
                                  <IconClock size={12} />
                                  <Text size="xs" c="dimmed">
                                    Duration: {dog.lastWalk.duration} min
                                  </Text>
                                </Group>
                                {dog.lastWalk.notes && (
                                  <Group gap="xs">
                                    <IconNotes size={12} />
                                    <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
                                      {dog.lastWalk.notes}
                                    </Text>
                                  </Group>
                                )}
                              </Stack>
                            ) : (
                              <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
                                Not walked today
                              </Text>
                            )}
                          </Box>

                          <Button
                            variant="light"
                            color={dog.hasBeenWalked ? "green" : "orange"}
                            fullWidth
                            mt="auto"
                            size="xs"
                            onClick={() => {
                              if (!dog.hasBeenWalked) {
                                walkForm.setValues({
                                  dog_id: dog.pet_id,
                                  walk_date: new Date().toISOString().split('T')[0],
                                  start_time: '',
                                  duration: '30',
                                  notes: ''
                                });
                                setShowAddWalk(true);
                              }
                            }}
                            leftSection={dog.hasBeenWalked ? <IconCheck size={12} /> : <IconWalk size={12} />}
                          >
                            {dog.hasBeenWalked ? 'Already Walked' : 'Log Walk'}
                          </Button>
                        </Paper>
                      </GridCol>
                    ))}
                </Grid>
              </Card>

              {/* Today's Walks List */}
              {todaysWalks.length > 0 && (
                <Card shadow="sm" padding="md" radius="md" withBorder>
                  <Text fw={600} size="sm" mb="sm">Today's Walks</Text>
                  <Stack gap="sm">
                    {todaysWalks.map((walk) => (
                      <Paper key={walk.walk_id} p="sm" withBorder radius="md">
                        <Group justify="space-between" align="center">
                          <Group>
                            <Avatar size="xs" color="green">
                              <IconDog size={10} />
                            </Avatar>
                            <Box>
                              <Text fw={500} size="xs">
                                {walk.pets?.name || 'Unknown Dog'}
                              </Text>
                              <Text size="xs" c="dimmed">
                                Walked by {walk.users?.name || 'Unknown User'}
                              </Text>
                            </Box>
                          </Group>
                          <Group gap="sm">
                            <Badge variant="light" color="green" size="xs">
                              {walk.time_start}
                            </Badge>
                            <Badge variant="light" color="blue" size="xs">
                              {walk.duration} min
                            </Badge>
                          </Group>
                        </Group>
                        {walk.notes && (
                          <Text size="xs" c="dimmed" mt="xs" style={{ fontStyle: 'italic' }}>
                            {walk.notes}
                          </Text>
                        )}
                      </Paper>
                    ))}
                  </Stack>
                </Card>
              )}
            </Stack>
          </GridCol>
        </Grid>

        {/* Add Walk Modal */}
        <Modal 
          opened={showAddWalk} 
          onClose={() => setShowAddWalk(false)} 
          title="Log Dog Walk" 
          size="md"
        >
          <form onSubmit={walkForm.onSubmit(handleSubmitWalk)}>
            <Stack gap="md">
              <Select
                label="Select Dog"
                placeholder="Choose a dog to walk"
                data={dogs.map(dog => ({
                  value: dog.pet_id,
                  label: `${dog.name} (${dog.training_level})`
                }))}
                {...walkForm.getInputProps('dog_id')}
                required
              />
              <Group grow>
                <TextInput
                  label="Date"
                  type="date"
                  {...walkForm.getInputProps('walk_date')}
                  required
                />
                <TextInput
                  label="Start Time"
                  type="time"
                  {...walkForm.getInputProps('start_time')}
                  required
                />
              </Group>
              <Select
                label="Duration (minutes)"
                data={[
                  { value: '15', label: '15 minutes' },
                  { value: '30', label: '30 minutes' },
                  { value: '45', label: '45 minutes' },
                  { value: '60', label: '1 hour' }
                ]}
                {...walkForm.getInputProps('duration')}
              />
              <Textarea
                label="Notes (optional)"
                placeholder="Any observations or notes about the walk..."
                {...walkForm.getInputProps('notes')}
                rows={3}
              />
              <Group justify="flex-end">
                <Button variant="light" onClick={() => setShowAddWalk(false)}>
                  Cancel
                </Button>
                <Button type="submit" leftSection={<IconPlus size={16} />}>
                  Log Walk
                </Button>
              </Group>
            </Stack>
          </form>
        </Modal>
      </Container>
    </Box>
  );
} 