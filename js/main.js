'use strict';

(async () => {
  const ul = document.querySelector('ul');
  const rfrsh = document.querySelector('#refresh');
  const form = document.querySelector('form');
  const animalName = form.elements.animalName;
  const species = form.elements.species;

  if('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('./sw.js');
      const swRegistration = await navigator.serviceWorker.ready;
      if('sync' in swRegistration) {
        form.addEventListener('submit', async (event) => {
          event.preventDefault();
          const animal = {
            animalName: animalName.value,
            species: species.value
          };
          const ready = await saveData('outbox', animal);
          ready && (await swRegistration.sync.register('send-animal'));
          setTimeout(init, 500);
        });
      }
    } catch (error) {
      console.log('sw', error);
    }
  };

  const init = async () => {
    try {
      const animals = await getAnimals();
       let animalList = [];
       if (animals && animals !== undefined && animals !== null) {
        await clearData('inbox');
        await saveData('inbox', animals);
        animalList = animals;
       } else {
         const animalData = await loadData('inbox');
         animalList = animalData[0];
       }
       ul.innerHTML = '';
       for(let i = 0; i < animalList.length; i++) {
        ul.innerHTML += `<ul><li>Name: ${animalList[i].animalName}</li> <li>Species: ${animalList[i].species.speciesName}</li> <li>Category: ${animalList[i].species.category.categoryName}</li></ul>`
       }
    }
    catch (e) {
      console.log(e.message);
    }
  };

  init();

  rfrsh.addEventListener('click', init);
})();

