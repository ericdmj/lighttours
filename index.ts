import './style.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import maplibregl from 'maplibre-gl';
import {Deck} from '@deck.gl/core';
import {BASEMAP, vectorQuerySource, VectorTileLayer} from '@deck.gl/carto';
import {CollisionFilterExtension} from '@deck.gl/extensions';
import { ICON_MAPPING, ICON_WIDTH } from './iconUtils';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const accessToken = import.meta.env.VITE_API_ACCESS_TOKEN;
const connectionName = 'lighttours-factsmith'
const cartoConfig = {apiBaseUrl, accessToken, connectionName};
const port = process.env.PORT || 4000;

const INITIAL_VIEW_STATE = {
  latitude: 37.562, 
  longitude: -77.437,
  zoom: 12,
  bearing: 0,
  pitch: 45,
  minZoom: 3,
};

const deck = new Deck({
  canvas: 'deck-canvas',
  initialViewState: INITIAL_VIEW_STATE,
  controller: true,
});

let selectedCategories = [];
let lastSelectedCategory = null;
const loader = document.querySelector('#loader');

function updateSelectedCategories() {
  const checkboxes = Array.from(document.querySelectorAll('.category-container .categories'));
  const selectedValues = checkboxes
    .filter((checkbox: HTMLInputElement) => checkbox.checked)
    .map((checkbox: HTMLInputElement) => checkbox.value);

  selectedCategories = selectedValues.sort((a, b) => {
    if (a === lastSelectedCategory) return 1;
    if (b === lastSelectedCategory) return -1;
    return 0;
  });

  render();
}

function handleCheckboxChange(checkbox: HTMLInputElement) {
  const value = checkbox.value;
  lastSelectedCategory = checkbox.checked ? value : null;
  updateSelectedCategories();
}

const checkboxes = document.querySelectorAll('.category-container .categories');
checkboxes.forEach(checkbox => {
  checkbox.addEventListener('change', () => handleCheckboxChange(checkbox as HTMLInputElement));
});

const map = new maplibregl.Map({
  container: 'map',
  style: BASEMAP.DARK_MATTER,
  interactive: false
});

deck.setProps({
  onViewStateChange: ({viewState}) => {
    const {longitude, latitude, ...rest} = viewState;
    map.jumpTo({center: [longitude, latitude], ...rest});
  },
});

async function render() {
  loader!.classList.remove('hidden');
  const dataSource = vectorQuerySource({
    ...cartoConfig,   
    sqlQuery: `SELECT geom, Address, DisplayType, LocationType, LightCount, Inflatables, Animated, Music, Traditional, Notes  FROM ejlighttours.my_test_dataset.locations WHERE DisplayType IN UNNEST(@displayType)`,
    queryParameters: {
      displayType: selectedCategories
    }
  });

  const layers = [
    new VectorTileLayer({
      id: 'places',
      data: dataSource,
      pickable: true,
      pointType: 'icon',
      getIcon: d => {
        return {
          url: ICON_MAPPING[d.properties.DisplayType].icon,
          width: ICON_WIDTH,
          height: ICON_WIDTH,
        };
      },
      getIconSize: d => 15,
      iconSizeUnits: 'pixels',
      iconSizeScale: 2,
      iconBillboard: true,
      iconAlphaCutoff: -1,
      // Enable collision detection
      extensions: [new CollisionFilterExtension()],
      collisionEnabled: true,
      getCollisionPriority: d => Object.keys(selectedCategories).indexOf(d.properties.DisplayType),
      collisionTestProps: {
        sizeScale: ICON_WIDTH * 1.2,
        sizeMaxPixels: ICON_WIDTH * 1.2,
        sizeMinPixels: ICON_WIDTH * 1.2,
      },
      onDataLoad: () => {
        loader!.classList.add('hidden');
      }
    })
  ];

  deck.setProps({
    layers: layers,
    getTooltip: ({object}) =>  object && {
      html: `
      <div class="tooltip-container">
        <div class="tooltip-row">
          <div class="tooltip-key">Address</div>
          <div class="tooltip-value">${object.properties.Address}</div>
        </div>
        <div class="tooltip-row">
          <div class="tooltip-key">Display Type</div>
          <div class="tooltip-value">${object.properties.DisplayType}</div>
        </div>
        <div class="tooltip-row">
          <div class="tooltip-key">Location Type</div>
          <div class="tooltip-value">${object.properties.LocationType}</div>
        </div>
        <div class="tooltip-row">
          <div class="tooltip-key">Total Light Count</div>
          <div class="tooltip-value">${object.properties.LightCount}</div>
        </div>
        <div class="tooltip-row">
          <div class="tooltip-key">Inflatables</div>
          <div class="tooltip-value">${object.properties.Inflatables}</div>
        </div>
        <div class="tooltip-row">
          <div class="tooltip-key">Animated</div>
          <div class="tooltip-value">${object.properties.Animated}</div>
        </div>
        <div class="tooltip-row">
          <div class="tooltip-key">Music</div>
          <div class="tooltip-value">${object.properties.Music}</div>
        </div>
        <div class="tooltip-row">
          <div class="tooltip-key">Traditional decor</div>
          <div class="tooltip-value">${object.properties.Traditional}</div>
        </div>
        <div class="tooltip-row">
          <div class="tooltip-key">Other notes</div>
          <div class="tooltip-value">${object.properties.Notes}</div>
        </div>
      </div>
      `
    }
  });
}

updateSelectedCategories();
render();