

!(async function(){

  const cropster = require("./index.js")

  cropster.set_credentials("{{YOUR CROPSTER EMAIL}}","{{YOUR CROPSTER PASSWORD}}","{{YOUR CROPSTER GROUP ID}}")

  var locations = await cropster.get_locations()
  console.log(`Got ${locations.length} locations`)

  var machines = await cropster.get_machines()
  console.log(`Got ${machines.length} machines`)

  var profiles = await cropster.get_profiles()
  console.log(`Got ${profiles.single_origins.length} SO profiles`)
  console.log(`Got ${profiles.blends.length} Blend profiles`)

  var green = await cropster.get_green()
  console.log(`Got ${green.length} green lots`)


  console.log("Getting roast data. This could take a long time")
  var roasts = await cropster.get_roasts()
  console.log(`Got ${roasts.length} roasts`)



})()
