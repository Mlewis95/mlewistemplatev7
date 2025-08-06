import { useEffect, useState } from "react";
import type { Route } from "./+types/pets";
import { getPets, updatePet } from "~/lib/database";
import {
  Container, Title, Text, Card, Group, Button, Badge, Stack,
  Tabs, Switch, Grid, GridCol, Avatar, Paper, Modal, Box,
  Image, Divider, ActionIcon, useMantineTheme, LoadingOverlay,
  Alert, Textarea, Select, TextInput
} from '@mantine/core';
import {
  IconDog, IconCat, IconHeart, IconEdit, IconPhoto,
  IconAlertCircle, IconHome, IconUser, IconStar
} from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Adoptable Pets - Kenton County Animal Shelter" },
    { name: "description", content: "Browse adoptable dogs and cats at Kenton County Animal Shelter." },
  ];
}

export default function Pets() {
  const theme = useMantineTheme();
  const [activeTab, setActiveTab] = useState<string | null>('dogs');
  const [showFosterableOnly, setShowFosterableOnly] = useState(true);
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPet, setSelectedPet] = useState<any>(null);
  const [showPetModal, setShowPetModal] = useState(false);
  const [editingPet, setEditingPet] = useState<any>(null);

  // Mock current user (in real app, this would come from auth)
  const currentUser = {
    user_id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Morgan Lewis',
    role: 'manager' as 'volunteer' | 'manager'
  };

  // Form for editing pet details
  const editPetForm = useForm({
    initialValues: {
      name: '',
      notes: '',
      training_level: '',
      is_fosterable: false
    },
    validate: {
      name: (value) => value.trim().length === 0 ? 'Name is required' : null,
      training_level: (value) => !value ? 'Training level is required' : null
    }
  });

  useEffect(() => {
    loadPets();
  }, [activeTab, showFosterableOnly]);

  async function loadPets() {
    try {
      setLoading(true);
      const species = activeTab === 'cats' ? 'cat' : 'dog';
      let petsData = await getPets(species);
      
      // Filter by fosterable status if toggle is on
      if (showFosterableOnly) {
        petsData = petsData.filter(pet => pet.is_fosterable);
      }
      
      setPets(petsData);
    } catch (err) {
      console.error('Error loading pets:', err);
      setError(err instanceof Error ? err.message : 'Failed to load pets');
    } finally {
      setLoading(false);
    }
  }

  const handleEditPet = async (values: any) => {
    try {
      const updatedPet = await updatePet(editingPet.pet_id, {
        name: values.name,
        notes: values.notes,
        training_level: values.training_level,
        is_fosterable: values.is_fosterable
      });
      setPets(pets.map(pet => pet.pet_id === editingPet.pet_id ? updatedPet : pet));
      setEditingPet(null);
      editPetForm.reset();
      notifications.show({
        title: 'Success',
        message: 'Pet details updated successfully',
        color: 'green'
      });
    } catch (err) {
      console.error('Error updating pet:', err);
      notifications.show({
        title: 'Error',
        message: 'Failed to update pet details',
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

  const getLevelDescription = (level: string) => {
    switch (level.toLowerCase()) {
      case 'green': return 'Beginner friendly';
      case 'yellow': return 'Some experience needed';
      case 'blue': return 'Moderate experience';
      case 'red': return 'Experienced handler';
      case 'black': return 'Professional level';
      default: return 'Unknown level';
    }
  };

  const getPetImage = (pet: any) => {
    // In a real app, this would be the actual pet photo
    return pet.photo_url || `https://source.unsplash.com/400x300/?${pet.species},${pet.name}`;
  };

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

  return (
    <Box pos="relative" style={{ backgroundColor: theme.colors.background[0] }}>
      <Container size="xl">
        <Stack gap="xl">
          {/* Header */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" align="center">
              <Box>
                <Title order={1} c="dark.8">Adoptable Pets</Title>
                <Text c="dimmed" size="sm">Find your perfect companion</Text>
              </Box>
              <Group>
                <Switch
                  label="Show fosterable only"
                  checked={showFosterableOnly}
                  onChange={(event) => setShowFosterableOnly(event.currentTarget.checked)}
                  color="orange"
                />
              </Group>
            </Group>
          </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onChange={setActiveTab} variant="pills" color="orange">
            <Tabs.List justify="center" mb="xl">
              <Tabs.Tab 
                value="dogs" 
                leftSection={<IconDog size={16} />}
                size="lg"
              >
                Dogs ({pets.filter(p => p.species === 'dog').length})
              </Tabs.Tab>
              <Tabs.Tab 
                value="cats" 
                leftSection={<IconCat size={16} />}
                size="lg"
              >
                Cats ({pets.filter(p => p.species === 'cat').length})
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="dogs">
              <Grid gutter="lg">
                {pets.filter(pet => pet.species === 'dog').map((pet) => (
                  <GridCol key={pet.pet_id} span={{ base: 12, sm: 6, lg: 4 }}>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                      <Card.Section>
                        <Image
                          src={getPetImage(pet)}
                          height={200}
                          alt={pet.name}
                          fallbackSrc="https://placehold.co/400x200?text=No+Photo"
                        />
                      </Card.Section>

                      <Stack gap="sm" mt="md">
                        <Group justify="space-between" align="flex-start">
                          <Box style={{ flex: 1 }}>
                            <Title order={3} size="h4">{pet.name}</Title>
                            <Text size="sm" c="dimmed">ID: {pet.pet_id.slice(0, 8)}...</Text>
                          </Box>
                          {currentUser.role === 'manager' && (
                            <ActionIcon
                              variant="light"
                              color="blue"
                              onClick={() => {
                                setEditingPet(pet);
                                editPetForm.setValues({
                                  name: pet.name,
                                  notes: pet.notes || '',
                                  training_level: pet.training_level,
                                  is_fosterable: pet.is_fosterable
                                });
                              }}
                            >
                              <IconEdit size={16} />
                            </ActionIcon>
                          )}
                        </Group>

                        <Group gap="xs">
                          <Badge 
                            color={getLevelColor(pet.training_level)} 
                            variant="light"
                            size="sm"
                          >
                            {pet.training_level} Level
                          </Badge>
                          {pet.is_fosterable && (
                            <Badge color="green" variant="light" size="sm" leftSection={<IconHeart size={12} />}>
                              Fosterable
                            </Badge>
                          )}
                        </Group>

                        {pet.notes && (
                          <Text size="sm" lineClamp={2}>
                            {pet.notes}
                          </Text>
                        )}

                        <Button
                          variant="light"
                          color="orange"
                          fullWidth
                          onClick={() => {
                            setSelectedPet(pet);
                            setShowPetModal(true);
                          }}
                        >
                          View Details
                        </Button>
                      </Stack>
                    </Card>
                  </GridCol>
                ))}
              </Grid>
            </Tabs.Panel>

            <Tabs.Panel value="cats">
              <Grid gutter="lg">
                {pets.filter(pet => pet.species === 'cat').map((pet) => (
                  <GridCol key={pet.pet_id} span={{ base: 12, sm: 6, lg: 4 }}>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                      <Card.Section>
                        <Image
                          src={getPetImage(pet)}
                          height={200}
                          alt={pet.name}
                          fallbackSrc="https://placehold.co/400x200?text=No+Photo"
                        />
                      </Card.Section>

                      <Stack gap="sm" mt="md">
                        <Group justify="space-between" align="flex-start">
                          <Box style={{ flex: 1 }}>
                            <Title order={3} size="h4">{pet.name}</Title>
                            <Text size="sm" c="dimmed">ID: {pet.pet_id.slice(0, 8)}...</Text>
                          </Box>
                          {currentUser.role === 'manager' && (
                            <ActionIcon
                              variant="light"
                              color="blue"
                              onClick={() => {
                                setEditingPet(pet);
                                editPetForm.setValues({
                                  name: pet.name,
                                  notes: pet.notes || '',
                                  training_level: pet.training_level,
                                  is_fosterable: pet.is_fosterable
                                });
                              }}
                            >
                              <IconEdit size={16} />
                            </ActionIcon>
                          )}
                        </Group>

                        <Group gap="xs">
                          <Badge 
                            color={getLevelColor(pet.training_level)} 
                            variant="light"
                            size="sm"
                          >
                            {pet.training_level} Level
                          </Badge>
                          {pet.is_fosterable && (
                            <Badge color="green" variant="light" size="sm" leftSection={<IconHeart size={12} />}>
                              Fosterable
                            </Badge>
                          )}
                        </Group>

                        {pet.notes && (
                          <Text size="sm" lineClamp={2}>
                            {pet.notes}
                          </Text>
                        )}

                        <Button
                          variant="light"
                          color="orange"
                          fullWidth
                          onClick={() => {
                            setSelectedPet(pet);
                            setShowPetModal(true);
                          }}
                        >
                          View Details
                        </Button>
                      </Stack>
                    </Card>
                  </GridCol>
                ))}
              </Grid>
            </Tabs.Panel>
          </Tabs>

          {/* Empty State */}
          {pets.length === 0 && (
            <Card shadow="sm" padding="xl" radius="md" withBorder>
              <Box ta="center">
                <IconHome size={64} color={theme.colors.gray[4]} />
                <Title order={3} mt="md" c="dimmed">No pets available</Title>
                <Text c="dimmed" size="sm">
                  {showFosterableOnly 
                    ? `No fosterable ${activeTab} available at the moment.` 
                    : `No ${activeTab} available at the moment.`
                  }
                </Text>
              </Box>
            </Card>
          )}
        </Stack>

        {/* Pet Details Modal */}
        <Modal 
          opened={showPetModal} 
          onClose={() => setShowPetModal(false)} 
          title="Pet Details" 
          size="lg"
        >
          {selectedPet && (
            <Stack gap="lg">
              <Image
                src={getPetImage(selectedPet)}
                height={300}
                radius="md"
                alt={selectedPet.name}
                fallbackSrc="https://placehold.co/600x300?text=No+Photo"
              />
              
              <Box>
                <Title order={2} mb="sm">{selectedPet.name}</Title>
                <Group gap="md" mb="md">
                  <Badge 
                    color={getLevelColor(selectedPet.training_level)} 
                    variant="light"
                    size="lg"
                  >
                    {selectedPet.training_level} Level
                  </Badge>
                  {selectedPet.is_fosterable && (
                    <Badge color="green" variant="light" size="lg" leftSection={<IconHeart size={16} />}>
                      Available for Foster
                    </Badge>
                  )}
                </Group>
                
                <Text size="sm" c="dimmed" mb="md">
                  {getLevelDescription(selectedPet.training_level)}
                </Text>

                {selectedPet.notes && (
                  <Box>
                    <Title order={4} mb="sm">Temperament Notes</Title>
                    <Paper p="md" withBorder radius="md">
                      <Text>{selectedPet.notes}</Text>
                    </Paper>
                  </Box>
                )}

                <Group mt="xl" justify="space-between">
                  <Text size="sm" c="dimmed">
                    Pet ID: {selectedPet.pet_id}
                  </Text>
                  {currentUser.role === 'manager' && (
                    <Button
                      variant="light"
                      color="blue"
                      leftSection={<IconEdit size={16} />}
                      onClick={() => {
                        setShowPetModal(false);
                        setEditingPet(selectedPet);
                        editPetForm.setValues({
                          name: selectedPet.name,
                          notes: selectedPet.notes || '',
                          training_level: selectedPet.training_level,
                          is_fosterable: selectedPet.is_fosterable
                        });
                      }}
                    >
                      Edit Details
                    </Button>
                  )}
                </Group>
              </Box>
            </Stack>
          )}
        </Modal>

        {/* Edit Pet Modal */}
        <Modal 
          opened={!!editingPet} 
          onClose={() => setEditingPet(null)} 
          title="Edit Pet Details" 
          size="md"
        >
          <form onSubmit={editPetForm.onSubmit(handleEditPet)}>
            <Stack gap="md">
              <TextInput
                label="Pet Name"
                placeholder="Enter pet name"
                {...editPetForm.getInputProps('name')}
                required
              />
              
              <Select
                label="Training Level"
                data={[
                  { value: 'Green', label: 'Green - Beginner friendly' },
                  { value: 'Yellow', label: 'Yellow - Some experience needed' },
                  { value: 'Blue', label: 'Blue - Moderate experience' },
                  { value: 'Red', label: 'Red - Experienced handler' },
                  { value: 'Black', label: 'Black - Professional level' }
                ]}
                {...editPetForm.getInputProps('training_level')}
                required
              />
              
              <Textarea
                label="Temperament Notes"
                placeholder="Describe the pet's temperament, behavior, and any special needs..."
                {...editPetForm.getInputProps('notes')}
                rows={4}
              />
              
              <Switch
                label="Available for fostering"
                {...editPetForm.getInputProps('is_fosterable', { type: 'checkbox' })}
                color="green"
              />
              
              <Group justify="flex-end">
                <Button variant="light" onClick={() => setEditingPet(null)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Update Pet
                </Button>
              </Group>
            </Stack>
          </form>
        </Modal>
      </Container>
    </Box>
  );
}
