const fetchGraphql = async (query) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(query),
  };
  try {
    const response = await fetch('http://localhost:3000/graphql', options);
    const json = await response.json();
    return json.data;
  }
  catch (e) {
    console.log(e);
    return false;
  }
};

const saveAnimal = async (animal) => {
  const query = {
    query: `
    mutation {
      addAnimal(animalName: "${animal.animalName}", species: "${animal.species}"){
        id
        animalName
      }
    }
    `,
    variables: animal,
  };
  const data = await fetchGraphql(query);
  return data.addAnimal;
};

const getAnimals = async () => {
  const otherQuery = {
    query: `
    {
      animals {
        id
        animalName
        species {
          speciesName
          category {
            categoryName
          }
        }
      }
    }
    `,
  };
  const data = await fetchGraphql(otherQuery);
  return data.animals;
};