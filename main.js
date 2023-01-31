let kickstarter = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json"
let movies = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json'
let videogames = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json'

let height = 800;
let width = 1200;
let margin = 60;

const colors = ['#4c92c3','#ff993e','#ade5a1','#de5253','#bed2ed','#ffc993','#56b356','#a3786f','#d0b0a9','#ffadab','#ade5a1','#a3786f','#d0b0a9','#e992ce','#999999','#f9c5db','#d1c0dd']
let dataObj;


d3.select('body').append('svg').attr('id','canvas').attr('width', width).attr('height',height)

const svg = d3.select('svg')

const drawTheTreeMap = () =>{
    console.log(dataObj)
};


async function fetchTheData(url){
    try {
        countyReq = await fetch(url)
        .then((res)=>res.json())
        .then((res)=> dataObj = res)

        drawTheTreeMap();

      } catch (error) {
        console.error('There was an error', error);
      }
}

//handle on click
const fetchTheMovies = () =>{ fetchTheData (movies)}
const fetchTheKick = () =>{ fetchTheData (kickstarter)}
const fetchTheGames = () =>{ fetchTheData (videogames)}

fetchTheMovies();

