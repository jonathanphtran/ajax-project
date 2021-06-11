var $showOptions = document.querySelector('.menu-pop');
var $overlay = document.querySelector('.overlay');
var $filters = document.querySelector('.form-filters');
var $searchButton = document.querySelector('.fa-search');
var $searchInput = document.querySelector('#search');
var $itemListDisplay = document.querySelector('.col-70');
var $closeModal = document.querySelector('.fa-times');
var $modal = document.querySelector('.modal');

var selectedFilters = {};
var apiKey = '6b234cfffb34a3d127db1475f24593ae';
var apiID = 'e432a515';
var food = '';

$closeModal.addEventListener('click', closeModal);
$showOptions.addEventListener('click', showOptions);
$filters.addEventListener('click', selectFilter);
$searchButton.addEventListener('click', function () {
  var searchValue = search(event);
  getAPIValue(searchValue);
});

function showOptions(event) {
  $overlay.classList.remove('hidden');
  $modal.classList.remove('hidden');
}

function closeModal(event) {
  $overlay.classList.add('hidden');
  $modal.classList.add('hidden');
}

function selectFilter(event) {
  var filterName = event.target.getAttribute('id');
  if (event.target.className === 'filter-ops' && !selectedFilters[filterName]) {
    selectedFilters[filterName] = true;
  } else if (selectedFilters[filterName]) {
    delete selectedFilters[filterName];
  }
}

function search(event) {
  food = '';
  food = $searchInput.value;
  var replaceSpaceFood = food.replace(' ', '%20');
  return replaceSpaceFood;
}

function getAPIValue(searchFood) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.edamam.com/api/food-database/v2/parser?ingr=' + searchFood + `&app_id=${apiID}&app_key=${apiKey}`);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    generateDomTree(xhr);
    var xhrLoaded = xhr;
    return xhrLoaded;
  });
  xhr.send();
}

function generateDomTree(foodValues) {
  $itemListDisplay.innerHTML = null;
  if (foodValues.response.hints.length === 0) {
    var announcement = document.createElement('h1');
    var announcementText = document.createTextNode('There are 0 results!');
    announcement.append(announcementText);
    $itemListDisplay.append(announcement);
    return;
  }
  for (var i = 0; i < foodValues.response.hints.length; i++) {
    var foodLabel = foodValues.response.hints[i].food.label;
    var foodImageSrc = foodValues.response.hints[i].food.image;
    var nutrients = foodValues.response.hints[i].food.nutrients;

    var macroList = {};

    if (foodValues.response.hints[i].food.image === undefined) {
      foodImageSrc = 'https://vetmed.tamu.edu/news/wp-content/uploads/sites/9/2020/09/Llama-and-Alpaca-Pet-Talk.jpg';
    }

    var calories = Math.round(nutrients.ENERC_KCAL, 2);
    var carbs = Math.round(nutrients.CHOCDF, 2);
    var fats = Math.round(nutrients.FAT, 2);
    var protein = Math.round(nutrients.PROCNT, 2);

    macroList.calories = calories;
    macroList.carbs = carbs;
    macroList.fats = fats;
    macroList.protein = protein;

    var individualItem = document.createElement('div');
    var image = document.createElement('img');
    var itemInfo = document.createElement('div');
    var itemName = document.createElement('h3');
    var options = document.createElement('div');
    var favoriteIcon = document.createElement('i');
    var itemDivider = document.createElement('hr');

    individualItem.setAttribute('class', 'row-90 item');
    image.setAttribute('class', 'column item-img');
    image.setAttribute('src', foodImageSrc);
    image.setAttribute('alt', 'Item Preview');
    itemInfo.setAttribute('class', 'column item-desc-container');
    itemName.setAttribute('class', 'item-name ellipsis');
    options.setAttribute('class', 'item-options');
    favoriteIcon.setAttribute('class', 'far fa-heart');
    itemDivider.setAttribute('class', 'item-divider');

    individualItem.append(image);

    var itemNameText = document.createTextNode(foodLabel);
    itemName.append(itemNameText);
    itemInfo.append(itemName);
    individualItem.append(itemInfo);

    for (var macro in macroList) {
      var itemDesc = document.createElement('h4');
      itemDesc.setAttribute('class', 'item-desc');
      var itemDescText = document.createTextNode(`${macro}: ` + macroList[macro]);
      itemDesc.append(itemDescText);
      itemInfo.append(itemDesc);
      individualItem.append(itemInfo);
    }

    options.append(favoriteIcon);
    individualItem.append(options);

    $itemListDisplay.append(individualItem);
    $itemListDisplay.append(itemDivider);
  }

}
