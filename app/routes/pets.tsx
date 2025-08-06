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
  IconAlertCircle, IconHome, IconUser, IconStar, IconFilter
} from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Pets - Kenton County Animal Shelter" },
    { name: "description", content: "Browse dogs and cats at Kenton County Animal Shelter." },
  ];
}

export default function Pets() {
  const theme = useMantineTheme();
  const [activeTab, setActiveTab] = useState<string | null>('dogs');
  const [showFosterableOnly, setShowFosterableOnly] = useState(false);
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPet, setSelectedPet] = useState<any>(null);
  const [showPetModal, setShowPetModal] = useState(false);
  const [editingPet, setEditingPet] = useState<any>(null);
  
  // Dog filters
  const [dogFilters, setDogFilters] = useState({
    age: '',
    size: '',
    gender: '',
    goodWithKids: false,
    goodWithDogs: false,
    goodWithCats: false
  });
  const [showDogFilters, setShowDogFilters] = useState(false);

  // Cat filters
  const [catFilters, setCatFilters] = useState({
    age: '',
    size: '',
    gender: '',
    goodWithKids: false,
    goodWithDogs: false,
    goodWithCats: false
  });
  const [showCatFilters, setShowCatFilters] = useState(false);

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
      is_fosterable: false,
      age_category: '',
      size: '',
      gender: '',
      good_with_kids: false,
      good_with_dogs: false,
      good_with_cats: false,
      photo_url: ''
    },
    validate: {
      name: (value) => value.trim().length === 0 ? 'Name is required' : null,
      training_level: (value) => !value ? 'Training level is required' : null
    }
  });

  useEffect(() => {
    loadPets();
  }, [showFosterableOnly]);

  async function loadPets() {
    try {
      setLoading(true);
      // Load all pets (both dogs and cats)
      const [dogsData, catsData] = await Promise.all([
        getPets('dog'),
        getPets('cat')
      ]);
      
      // Combine all pets
      let allPets = [...dogsData, ...catsData];
      
      // Filter by fosterable status if toggle is on
      if (showFosterableOnly) {
        allPets = allPets.filter(pet => pet.is_fosterable);
      }
      
      // Sort by length of stay (longest to shortest)
      allPets.sort((a, b) => {
        const dateA = new Date(a.entry_date);
        const dateB = new Date(b.entry_date);
        return dateA.getTime() - dateB.getTime(); // Oldest first (longest resident)
      });
      
      setPets(allPets);
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
        is_fosterable: values.is_fosterable,
        age_category: values.age_category,
        size: values.size,
        gender: values.gender,
        good_with_kids: values.good_with_kids,
        good_with_dogs: values.good_with_dogs,
        good_with_cats: values.good_with_cats,
        photo_url: values.photo_url
      } as any);
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

  // Helper function to calculate days in shelter
  const getDaysInShelter = (entryDate: string) => {
    const entry = new Date(entryDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - entry.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get the longest resident for each species
  const getLongestResident = (species: string) => {
    const speciesPets = pets.filter(pet => pet.species === species);
    if (speciesPets.length === 0) return null;
    
    return speciesPets.reduce((longest, current) => {
      const longestDays = getDaysInShelter(longest.entry_date);
      const currentDays = getDaysInShelter(current.entry_date);
      return currentDays > longestDays ? current : longest;
    });
  };

  // Filter dogs based on selected criteria
  const getFilteredDogs = () => {
    return pets.filter(pet => pet.species === 'dog').filter(dog => {
      // Age filter
      if (dogFilters.age && dog.age_category !== dogFilters.age) return false;
      
      // Size filter
      if (dogFilters.size && dog.size !== dogFilters.size) return false;
      
      // Gender filter
      if (dogFilters.gender && dog.gender !== dogFilters.gender) return false;
      
      // Good with kids filter
      if (dogFilters.goodWithKids && !dog.good_with_kids) return false;
      
      // Good with dogs filter
      if (dogFilters.goodWithDogs && !dog.good_with_dogs) return false;
      
      // Good with cats filter
      if (dogFilters.goodWithCats && !dog.good_with_cats) return false;
      
      return true;
    });
  };

  // Clear all dog filters
  const clearDogFilters = () => {
    setDogFilters({
      age: '',
      size: '',
      gender: '',
      goodWithKids: false,
      goodWithDogs: false,
      goodWithCats: false
    });
  };

  // Filter cats based on selected criteria
  const getFilteredCats = () => {
    return pets.filter(pet => pet.species === 'cat').filter(cat => {
      // Age filter
      if (catFilters.age && cat.age_category !== catFilters.age) return false;
      
      // Size filter
      if (catFilters.size && cat.size !== catFilters.size) return false;
      
      // Gender filter
      if (catFilters.gender && cat.gender !== catFilters.gender) return false;
      
      // Good with kids filter
      if (catFilters.goodWithKids && !cat.good_with_kids) return false;
      
      // Good with dogs filter
      if (catFilters.goodWithDogs && !cat.good_with_dogs) return false;
      
      // Good with cats filter
      if (catFilters.goodWithCats && !cat.good_with_cats) return false;
      
      return true;
    });
  };

  // Clear all cat filters
  const clearCatFilters = () => {
    setCatFilters({
      age: '',
      size: '',
      gender: '',
      goodWithKids: false,
      goodWithDogs: false,
      goodWithCats: false
    });
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
        <Grid gutter="md">
                     {/* Left Sidebar - Pet Types */}
           <GridCol span={{ base: 12, lg: 3 }}>
             <Card shadow="sm" padding="md" radius="md" withBorder>
               <Text fw={600} size="sm" mb="sm">Pet Types</Text>
               <Tabs value={activeTab} onChange={setActiveTab} variant="pills" color="orange">
                 <Tabs.List>
                   <Tabs.Tab 
                     value="dogs" 
                     leftSection={<IconDog size={14} />}
                     size="sm"
                   >
                     Dogs ({pets.filter(p => p.species === 'dog').length})
                   </Tabs.Tab>
                   <Tabs.Tab 
                     value="cats" 
                     leftSection={<IconCat size={14} />}
                     size="sm"
                   >
                     Cats ({pets.filter(p => p.species === 'cat').length})
                   </Tabs.Tab>
                 </Tabs.List>
               </Tabs>
             </Card>
           </GridCol>

          {/* Main Content */}
          <GridCol span={{ base: 12, lg: 9 }}>
            <Tabs value={activeTab} onChange={setActiveTab}>
              <Tabs.Panel value="dogs">
                                 {/* Dog Filters */}
                 <Card shadow="sm" padding="md" radius="md" withBorder mb="md">
                   <Group justify="space-between" align="center" mb="sm">
                     <Group gap="xs">
                       <IconFilter size={16} />
                       <Text fw={600} size="sm">Dog Filters</Text>
                     </Group>
                     <Group>
                       <Switch
                         label="Show fosterable only"
                         checked={showFosterableOnly}
                         onChange={(event) => setShowFosterableOnly(event.currentTarget.checked)}
                         color="orange"
                         size="sm"
                       />
                       <Button
                         variant="light"
                         size="xs"
                         onClick={() => setShowDogFilters(!showDogFilters)}
                       >
                         {showDogFilters ? 'Hide' : 'Show'}
                       </Button>
                       <Button
                         variant="light"
                         color="red"
                         size="xs"
                         onClick={clearDogFilters}
                       >
                         Clear
                       </Button>
                     </Group>
                   </Group>

                  {showDogFilters && (
                    <Grid gutter="md">
                      <GridCol span={{ base: 12, sm: 6, md: 3 }}>
                        <Select
                          label="Age"
                          placeholder="Select age"
                          data={[
                            { value: 'puppy', label: 'Puppy' },
                            { value: 'adult', label: 'Adult' },
                            { value: 'senior', label: 'Senior' }
                          ]}
                          value={dogFilters.age}
                          onChange={(value) => setDogFilters({ ...dogFilters, age: value || '' })}
                          clearable
                        />
                      </GridCol>
                      <GridCol span={{ base: 12, sm: 6, md: 3 }}>
                        <Select
                          label="Size"
                          placeholder="Select size"
                          data={[
                            { value: 'small', label: 'Small' },
                            { value: 'medium', label: 'Medium' },
                            { value: 'large', label: 'Large' }
                          ]}
                          value={dogFilters.size}
                          onChange={(value) => setDogFilters({ ...dogFilters, size: value || '' })}
                          clearable
                        />
                      </GridCol>
                      <GridCol span={{ base: 12, sm: 6, md: 3 }}>
                        <Select
                          label="Gender"
                          placeholder="Select gender"
                          data={[
                            { value: 'male', label: 'Male' },
                            { value: 'female', label: 'Female' }
                          ]}
                          value={dogFilters.gender}
                          onChange={(value) => setDogFilters({ ...dogFilters, gender: value || '' })}
                          clearable
                        />
                      </GridCol>
                      <GridCol span={{ base: 12, sm: 6, md: 3 }}>
                        <Stack gap="xs">
                          <Text size="sm" fw={500}>Good With:</Text>
                          <Switch
                            label="Kids"
                            checked={dogFilters.goodWithKids}
                            onChange={(event) => setDogFilters({ ...dogFilters, goodWithKids: event.currentTarget.checked })}
                            size="sm"
                          />
                          <Switch
                            label="Other Dogs"
                            checked={dogFilters.goodWithDogs}
                            onChange={(event) => setDogFilters({ ...dogFilters, goodWithDogs: event.currentTarget.checked })}
                            size="sm"
                          />
                          <Switch
                            label="Cats"
                            checked={dogFilters.goodWithCats}
                            onChange={(event) => setDogFilters({ ...dogFilters, goodWithCats: event.currentTarget.checked })}
                            size="sm"
                          />
                        </Stack>
                      </GridCol>
                    </Grid>
                  )}
                </Card>

                <Grid gutter="lg">
                  {getFilteredDogs().map((pet) => (
                                         <GridCol key={pet.pet_id} span={{ base: 12, sm: 6, lg: 4 }}>
                       <Card shadow="sm" padding="lg" radius="md" withBorder style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                         <Card.Section pos="relative">
                           <Image
                             src={getPetImage(pet)}
                             height={200}
                             alt={pet.name}
                             fallbackSrc="https://placehold.co/400x200?text=No+Photo"
                           />
                           {getLongestResident('dog')?.pet_id === pet.pet_id && (
                             <Badge 
                               color="red" 
                               variant="filled" 
                               size="sm"
                               style={{
                                 position: 'absolute',
                                 top: 8,
                                 right: 8,
                                 zIndex: 10
                               }}
                             >
                               Longest Resident
                             </Badge>
                           )}
                         </Card.Section>

                         <Stack gap="sm" mt="md" style={{ flex: 1 }}>
                           <Group justify="space-between" align="flex-start">
                             <Box style={{ flex: 1 }}>
                               <Title order={3} size="h4">{pet.name}</Title>
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
                                     is_fosterable: pet.is_fosterable,
                                     age_category: pet.age_category || '',
                                     size: pet.size || '',
                                     gender: pet.gender || '',
                                     good_with_kids: pet.good_with_kids || false,
                                     good_with_dogs: pet.good_with_dogs || false,
                                     good_with_cats: pet.good_with_cats || false,
                                     photo_url: pet.photo_url || ''
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

                          {/* Pet Details */}
                          <Group gap="xs" wrap="wrap">
                            {pet.age_category && (
                              <Badge variant="outline" size="xs" color="blue">
                                {pet.age_category.charAt(0).toUpperCase() + pet.age_category.slice(1)}
                              </Badge>
                            )}
                            {pet.size && (
                              <Badge variant="outline" size="xs" color="gray">
                                {pet.size.charAt(0).toUpperCase() + pet.size.slice(1)}
                              </Badge>
                            )}
                            {pet.gender && (
                              <Badge variant="outline" size="xs" color="pink">
                                {pet.gender.charAt(0).toUpperCase() + pet.gender.slice(1)}
                              </Badge>
                            )}
                          </Group>

                          {/* Compatibility */}
                          {(pet.good_with_kids || pet.good_with_dogs || pet.good_with_cats) && (
                            <Group gap="xs" wrap="wrap">
                              <Text size="xs" c="dimmed">Good with:</Text>
                              {pet.good_with_kids && (
                                <Badge variant="dot" size="xs" color="green">
                                  Kids
                                </Badge>
                              )}
                              {pet.good_with_dogs && (
                                <Badge variant="dot" size="xs" color="blue">
                                  Dogs
                                </Badge>
                              )}
                              {pet.good_with_cats && (
                                <Badge variant="dot" size="xs" color="orange">
                                  Cats
                                </Badge>
                              )}
                            </Group>
                          )}

                          {pet.notes && (
                            <Text size="sm" lineClamp={2}>
                              {pet.notes}
                            </Text>
                          )}

                          <Button
                            variant="light"
                            color="orange"
                            fullWidth
                            style={{ marginTop: 'auto' }}
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

                {/* Empty State for Dogs */}
                {getFilteredDogs().length === 0 && (
                  <Card shadow="sm" padding="md" radius="md" withBorder>
                    <Box ta="center">
                      <IconHome size={32} color={theme.colors.gray[4]} />
                      <Text fw={600} size="sm" mt="sm" c="dimmed">No dogs available</Text>
                      <Text size="xs" c="dimmed">
                        {showFosterableOnly 
                          ? 'No fosterable dogs available at the moment.' 
                          : 'No dogs available at the moment.'
                        }
                      </Text>
                    </Box>
                  </Card>
                )}
              </Tabs.Panel>

              <Tabs.Panel value="cats">
                                 {/* Cat Filters */}
                 <Card shadow="sm" padding="md" radius="md" withBorder mb="md">
                   <Group justify="space-between" align="center" mb="sm">
                     <Group gap="xs">
                       <IconFilter size={16} />
                       <Text fw={600} size="sm">Cat Filters</Text>
                     </Group>
                     <Group>
                       <Switch
                         label="Show fosterable only"
                         checked={showFosterableOnly}
                         onChange={(event) => setShowFosterableOnly(event.currentTarget.checked)}
                         color="orange"
                         size="sm"
                       />
                       <Button
                         variant="light"
                         size="xs"
                         onClick={() => setShowCatFilters(!showCatFilters)}
                       >
                         {showCatFilters ? 'Hide' : 'Show'}
                       </Button>
                       <Button
                         variant="light"
                         color="red"
                         size="xs"
                         onClick={clearCatFilters}
                       >
                         Clear
                       </Button>
                     </Group>
                   </Group>

                  {showCatFilters && (
                    <Grid gutter="md">
                      <GridCol span={{ base: 12, sm: 6, md: 3 }}>
                        <Select
                          label="Age"
                          placeholder="Select age"
                          data={[
                            { value: 'puppy', label: 'Kitten' },
                            { value: 'adult', label: 'Adult' },
                            { value: 'senior', label: 'Senior' }
                          ]}
                          value={catFilters.age}
                          onChange={(value) => setCatFilters({ ...catFilters, age: value || '' })}
                          clearable
                        />
                      </GridCol>
                      <GridCol span={{ base: 12, sm: 6, md: 3 }}>
                        <Select
                          label="Size"
                          placeholder="Select size"
                          data={[
                            { value: 'small', label: 'Small' },
                            { value: 'medium', label: 'Medium' },
                            { value: 'large', label: 'Large' }
                          ]}
                          value={catFilters.size}
                          onChange={(value) => setCatFilters({ ...catFilters, size: value || '' })}
                          clearable
                        />
                      </GridCol>
                      <GridCol span={{ base: 12, sm: 6, md: 3 }}>
                        <Select
                          label="Gender"
                          placeholder="Select gender"
                          data={[
                            { value: 'male', label: 'Male' },
                            { value: 'female', label: 'Female' }
                          ]}
                          value={catFilters.gender}
                          onChange={(value) => setCatFilters({ ...catFilters, gender: value || '' })}
                          clearable
                        />
                      </GridCol>
                      <GridCol span={{ base: 12, sm: 6, md: 3 }}>
                        <Stack gap="xs">
                          <Text size="sm" fw={500}>Good With:</Text>
                          <Switch
                            label="Kids"
                            checked={catFilters.goodWithKids}
                            onChange={(event) => setCatFilters({ ...catFilters, goodWithKids: event.currentTarget.checked })}
                            size="sm"
                          />
                          <Switch
                            label="Dogs"
                            checked={catFilters.goodWithDogs}
                            onChange={(event) => setCatFilters({ ...catFilters, goodWithDogs: event.currentTarget.checked })}
                            size="sm"
                          />
                          <Switch
                            label="Other Cats"
                            checked={catFilters.goodWithCats}
                            onChange={(event) => setCatFilters({ ...catFilters, goodWithCats: event.currentTarget.checked })}
                            size="sm"
                          />
                        </Stack>
                      </GridCol>
                    </Grid>
                  )}
                </Card>

                <Grid gutter="lg">
                  {getFilteredCats().map((pet) => (
                                         <GridCol key={pet.pet_id} span={{ base: 12, sm: 6, lg: 4 }}>
                       <Card shadow="sm" padding="lg" radius="md" withBorder style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                         <Card.Section pos="relative">
                           <Image
                             src={getPetImage(pet)}
                             height={200}
                             alt={pet.name}
                             fallbackSrc="https://placehold.co/400x200?text=No+Photo"
                           />
                           {getLongestResident('cat')?.pet_id === pet.pet_id && (
                             <Badge 
                               color="red" 
                               variant="filled" 
                               size="sm"
                               style={{
                                 position: 'absolute',
                                 top: 8,
                                 right: 8,
                                 zIndex: 10
                               }}
                             >
                               Longest Resident
                             </Badge>
                           )}
                         </Card.Section>

                         <Stack gap="sm" mt="md" style={{ flex: 1 }}>
                           <Group justify="space-between" align="flex-start">
                             <Box style={{ flex: 1 }}>
                               <Title order={3} size="h4">{pet.name}</Title>
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
                                     is_fosterable: pet.is_fosterable,
                                     age_category: pet.age_category || '',
                                     size: pet.size || '',
                                     gender: pet.gender || '',
                                     good_with_kids: pet.good_with_kids || false,
                                     good_with_dogs: pet.good_with_dogs || false,
                                     good_with_cats: pet.good_with_cats || false,
                                     photo_url: pet.photo_url || ''
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

                          {/* Pet Details */}
                          <Group gap="xs" wrap="wrap">
                            {pet.age_category && (
                              <Badge variant="outline" size="xs" color="blue">
                                {pet.age_category === 'puppy' ? 'Kitten' : pet.age_category.charAt(0).toUpperCase() + pet.age_category.slice(1)}
                              </Badge>
                            )}
                            {pet.size && (
                              <Badge variant="outline" size="xs" color="gray">
                                {pet.size.charAt(0).toUpperCase() + pet.size.slice(1)}
                              </Badge>
                            )}
                            {pet.gender && (
                              <Badge variant="outline" size="xs" color="pink">
                                {pet.gender.charAt(0).toUpperCase() + pet.gender.slice(1)}
                              </Badge>
                            )}
                          </Group>

                          {/* Compatibility */}
                          {(pet.good_with_kids || pet.good_with_dogs || pet.good_with_cats) && (
                            <Group gap="xs" wrap="wrap">
                              <Text size="xs" c="dimmed">Good with:</Text>
                              {pet.good_with_kids && (
                                <Badge variant="dot" size="xs" color="green">
                                  Kids
                                </Badge>
                              )}
                              {pet.good_with_dogs && (
                                <Badge variant="dot" size="xs" color="blue">
                                  Dogs
                                </Badge>
                              )}
                              {pet.good_with_cats && (
                                <Badge variant="dot" size="xs" color="orange">
                                  Cats
                                </Badge>
                              )}
                            </Group>
                          )}

                          {pet.notes && (
                            <Text size="sm" lineClamp={2}>
                              {pet.notes}
                            </Text>
                          )}

                          <Button
                            variant="light"
                            color="orange"
                            fullWidth
                            style={{ marginTop: 'auto' }}
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

                {/* Empty State for Cats */}
                {getFilteredCats().length === 0 && (
                  <Card shadow="sm" padding="md" radius="md" withBorder>
                    <Box ta="center">
                      <IconHome size={32} color={theme.colors.gray[4]} />
                      <Text fw={600} size="sm" mt="sm" c="dimmed">No cats available</Text>
                      <Text size="xs" c="dimmed">
                        {showFosterableOnly 
                          ? 'No fosterable cats available at the moment.' 
                          : 'No cats available at the moment.'
                        }
                      </Text>
                    </Box>
                  </Card>
                )}
              </Tabs.Panel>
            </Tabs>
          </GridCol>
        </Grid>

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
                          is_fosterable: selectedPet.is_fosterable,
                          age_category: selectedPet.age_category || '',
                          size: selectedPet.size || '',
                          gender: selectedPet.gender || '',
                          good_with_kids: selectedPet.good_with_kids || false,
                          good_with_dogs: selectedPet.good_with_dogs || false,
                          good_with_cats: selectedPet.good_with_cats || false,
                          photo_url: selectedPet.photo_url || ''
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

              <Divider label="Pet Image" labelPosition="center" />

              <TextInput
                label="Image URL"
                placeholder="Enter image URL (e.g., https://example.com/pet-photo.jpg)"
                {...editPetForm.getInputProps('photo_url')}
                description="Provide a direct link to the pet's photo"
              />

              {editPetForm.values.photo_url && (
                <Box>
                  <Text size="sm" fw={500} mb="xs">Preview:</Text>
                  <Image
                    src={editPetForm.values.photo_url}
                    height={150}
                    alt="Pet preview"
                    fallbackSrc="https://placehold.co/400x200?text=Invalid+Image+URL"
                    radius="md"
                  />
                </Box>
              )}

              <Divider label="Additional Details" labelPosition="center" />

              <Select
                label="Age Category"
                placeholder="Select age category"
                data={[
                  { value: 'puppy', label: 'Puppy/Kitten' },
                  { value: 'adult', label: 'Adult' },
                  { value: 'senior', label: 'Senior' }
                ]}
                {...editPetForm.getInputProps('age_category')}
                clearable
              />

              <Select
                label="Size"
                placeholder="Select size"
                data={[
                  { value: 'small', label: 'Small' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'large', label: 'Large' }
                ]}
                {...editPetForm.getInputProps('size')}
                clearable
              />

              <Select
                label="Gender"
                placeholder="Select gender"
                data={[
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' }
                ]}
                {...editPetForm.getInputProps('gender')}
                clearable
              />

              <Divider label="Compatibility" labelPosition="center" />

              <Stack gap="xs">
                <Text size="sm" fw={500}>Good With:</Text>
                <Switch
                  label="Kids"
                  {...editPetForm.getInputProps('good_with_kids', { type: 'checkbox' })}
                  color="green"
                />
                <Switch
                  label="Dogs"
                  {...editPetForm.getInputProps('good_with_dogs', { type: 'checkbox' })}
                  color="blue"
                />
                <Switch
                  label="Cats"
                  {...editPetForm.getInputProps('good_with_cats', { type: 'checkbox' })}
                  color="orange"
                />
              </Stack>
              
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
