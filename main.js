let kickstarter = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json"
let movies = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json'
let videogames = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json'
//c9jje
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

    let createTreeMap = d3
    .treemap()
    .size([1200,570])

    createTreeMap(hierarchy);
    tilesFromData = hierarchy.leaves()

    let categories = tilesFromData.map(function(nodes){
      return nodes.data.category
    })
    let uniqueCategories = [...new Set(categories)]
        
        tile = svg
                .selectAll('g')
                .data(tilesFromData)
                .enter()
                .append('g')
                .attr('transform',(dataitem) => {return `translate(${dataitem['x0']},${dataitem['y0']})`})

        const tooltip = d3.select('#tooltip')
        tile
        .append('rect')
        .attr('class','tile')
        .attr('stroke','white')
        .attr('width', (dataitem) => {return dataitem['x1'] - dataitem['x0']})
        .attr('height',(dataitem) => {return dataitem['y1'] - dataitem['y0']})
        .attr('fill',(dataitem)=>{
          for(let i= 0; i < uniqueCategories.length; i++ ){
            if(uniqueCategories[i] === dataitem.data.category){
              return colors[i]
            }
          }
        })
        .attr('data-name',(dataitem)=>{return dataitem.data.name})
        .attr('data-category',(dataitem)=>{return dataitem.data.category})
        .attr('data-value',(dataitem)=>{return dataitem.data.value})

        tile
        .on('mousemove',(event,hoveredItem,index) => {
           tooltip
           .html(`Name: ${hoveredItem.data.name} <br> Category: ${hoveredItem.data.category}<br> Value: ${hoveredItem.data.value}`)
           .attr("data-value", hoveredItem.data.value)
           .style('left',(event.pageX) + "px")
           .style('top',(event.pageY) + "px")
           .style('color','black')
           .transition()
           .style('opacity','1')
           .attr('id','tooltip')
           
       })
       .on('mouseout', (event,hoveredItem,index)=>{
           tooltip
           .transition()
           .style('opacity','0')
       })

            tile
            .append('g')
            .html(function(dataitem){
            return `    
            <foreignobject x="0" y="0" width="${(dataitem['x1'] - dataitem['x0'])}" height="${dataitem['y1'] - dataitem['y0']}">
            <body xmlns="http://www.w3.org/1999/xhtml">
            <div class="tile-text">${dataitem.data.name}</div>
            </body>
            </foreignobject>`
            })
            
            svg.append('g')
                .attr('id','legend')
                

            let legend =svg.selectAll('#legend')
                          .attr('transform',`translate(${height/2},${width/2})`)

            let rectsize = 15;
            let elementsPerRow = 5;
            legend
            .selectAll('#legend')
            .data(uniqueCategories)
            .enter()
            .append('g')
            .attr('class','legend-group')
            .append('rect')
            .attr('class','legend-item')
            .attr('width',rectsize)
            .attr('height',rectsize)
            .attr('y', (d,i) => {return (i) % elementsPerRow * 20 - 10})
            .attr('x', (d,i) => {return -rectsize - 10 + Math.floor(i/elementsPerRow) * rectsize + 100 *Math.floor(i/elementsPerRow)})
            .attr('fill',(category) =>{
              for(let i= 0; i < uniqueCategories.length; i++ ){
                if(uniqueCategories[i] === category){
                  return colors[i]
                }
              }
            })

            svg
            .selectAll('.legend-group')
            .append('text')
            .attr('x', (d,i) => {return  Math.floor(i/elementsPerRow) * rectsize + 100 *Math.floor(i/elementsPerRow); console.log((i / elementsPerRow) * 20, i)})
            .attr('y', (d,i) => {return (i) % elementsPerRow * 20})
            .text((category) => {return category})
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

fetchTheData(kickstarter);

