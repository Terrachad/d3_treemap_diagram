let kickstarter = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json"
let movies = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json'
let videogames = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json'

let height = 800;
let width = 1200;
let margin = 60;

const colors =  
[
  '#1f77b4',
  '#aec7e8',
  '#ff7f0e',
  '#ffbb78',
  '#2ca02c',
  '#98df8a',
  '#d62728',
  '#ff9896',
  '#9467bd',
  '#c5b0d5',
  '#8c564b',
  '#c49c94',
  '#e377c2',
  '#f7b6d2',
  '#7f7f7f',
  '#c7c7c7',
  '#bcbd22',
  '#dbdb8d',
  '#17becf',
  '#9edae5'
]

let dataObj;
let hierarchy;
let tilesFromData;
let tile;

d3.select('body').append('svg').attr('id','canvas').attr('width', width).attr('height',height)

const svg = d3.select('svg')

const drawTheTreeMap = () =>{
    console.log(dataObj)
    hierarchy = d3
    .hierarchy(dataObj,
      (node) => {
        return node['children']
      })
    .sum(
      (node) => {
        return node['value']
      }
      )
    .sort(
      (node1,node2)=>{return node2['value'] - node1['value']}
    )

    d3
    .treemap()
    .size([width,height])
    (hierarchy)

    tilesFromData = hierarchy.leaves()
    console.log(tilesFromData)

    tile = svg
                .selectAll('g')
                .data(tilesFromData)
                .enter()
                .append('g')
                .attr('transform',(dataitem) => {return `translate(${dataitem['x0']},${dataitem['y0']})`})

        tile
        .append('rect')
        .attr('class','tile')
        .attr('width', (dataitem) => {return dataitem['x1'] - dataitem['x0']})
        .attr('height',(dataitem) => {return dataitem['y1'] - dataitem['y0']})

        tile.exit().remove();

 
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

