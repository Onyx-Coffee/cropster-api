

const cropster = {

  axios: require("axios"),
  
  set_credentials: function(email, password, group){
    this.bearer_token = btoa(`${email}:${password}`) 
    this.cropster_headers.authorization = "Basic " + this.bearer_token,
    this.group = group
  },

  group: "",

  bearer_token: "",

  cropster_headers: {
    'authority':'c-sar.cropster.com',
    'content-type':'application/vnd.api+json; charset=utf-8',
    'sec-fetch-mode':'cors',
    'cropster-authenticate':'suppress-www-authenticate',
    'authorization':"Basic " + this.bearer_token,
    'client-version':'cropster-core_0.0.1',
    'accept':'*/*',
    'sec-fetch-site':'same-origin'
  },

  get_locations: async function(){
    //GET
    var url = "https://c-sar.cropster.com/api/v2/locations?filter%5Blocations%5D%5Bgroup%5D="+this.group+"&include%5Blocations%5D%5B%5D=locationTypes"

    try {
      var resp = await this.axios({
        url: url,
        method:"GET",
        headers:this.cropster_headers
      })

      return resp.data.data

    }
    catch(e){

      console.log(e)

    }
  
  },
  get_machines: async function(){
    //GET
    var url = "https://c-sar.cropster.com/api/v2/machines?filter%5Bmachines%5D%5Bgroup%5D="+this.group+"&page%5Bsize%5D=999&page%5Bnumber%5D=0"

    try {
      var resp = await this.axios({
        url: url,
        method:"GET",
        headers:this.cropster_headers
      })


      return resp.data.data

    }
    catch(e){

      console.log(e)

    }

  },
  get_roasts: async function(limit){

    var local_axios = this.axios
    var local_headers = this.cropster_headers

    if (limit == null) limit = 20
    if (limit > 200) limit = 200

    var batches = await get_batches(limit)

    for (var batch of batches){
      var processing_id = batch.relationships.processing.data.id


      var processing_info = await get_processing(processing_id)
      var curves = await get_processing_curves(processing_id)

      batch.curves = curves
      batch.processing_info = processing_info

    }

    return batches


    

    async function get_batches(limit){

        var url = "https://c-sar.cropster.com/api/v2/lots?filter%5Blots%5D%5BincludeConsumed%5D=true&filter%5Blots%5D%5BprocessingStep%5D=coffee.roasting&filter%5Blots%5D%5Bgroup%5D="+local_group+"&include%5Blots%5D%5B%5D=processing&include%5Blots%5D%5B%5D=processing.machine&include%5Blots%5D%5B%5D=processing.profile&include%5Blots%5D%5B%5D=processing.profile.processingGoals&include%5Blots%5D%5B%5D=processing.processingMeasures&include%5Blots%5D%5B%5D=processingAlerts&page%5Bsize%5D="+limit+"&page%5Bnumber%5D=0&sort%5Blots%5D%5BcreationDate%5D=desc"

        try {
          var resp = await local_axios({
            url: url,
            method:"GET",
            headers:local_headers
          })


          return resp.data.data

        }
        catch(e){

          console.log(e)
          return []

        }




    }


    async function get_processing(processing_id){


      //get baseline stats about this roast
      var stats_url = "https://c-sar.cropster.com/api/v2/processings/" + processing_id

      try {
        var resp = await local_axios({
          url: stats_url,
          method:"GET",
          headers:local_headers
        })

        return resp.data.data

      }
      catch(e){

        console.log(e)
        return {}

      }
      

    }
    async function get_processing_curves(processing_id){

      //get roast profile
      var curves_url = "https://c-sar.cropster.com/api/v2/processings/"+processing_id+"/processingCurves"


      try {
        var resp = await local_axios({
          url: curves_url,
          method:"GET",
          headers:local_headers
        })

        return resp.data.data

      }
      catch(e){

        console.log(e)
        return {}

      }

    }

  },
  get_profiles: async function(){

    var local_axios = this.axios
    var local_headers = this.cropster_headers
    var local_group = this.group

    var blend_profiles = await get_blends()
    var so_profiles = await get_so()

    

    return {
      single_origins: so_profiles,
      blends: blend_profiles
    }


    async function get_blends(){
      var url_blends = "https://c-sar.cropster.com/api/v2/profiles?filter%5Bprofiles%5D%5Btype%5D=PRE_ROAST_BLEND&filter%5Bprofiles%5D%5Bgroup%5D="+local_group+"&include%5Bprofiles%5D%5B%5D=profileComponents&include%5Bprofiles%5D%5B%5D=restrictedMachines&include%5Bprofiles%5D%5B%5D=profileComponents.lots&include%5Bprofiles%5D%5B%5D=profileGroup&page%5Bsize%5D=200&page%5Bnumber%5D=0&sort%5Bprofiles%5D%5Bname%5D=asc"

      try {
        var resp = await local_axios({
          url: url_blends,
          method:"GET",
          headers:local_headers
        })

        return resp.data.data

      }
      catch(e){

        return []

      }

    }

    async function get_so(){
      var url_single_origins = "https://c-sar.cropster.com/api/v2/profiles?filter%5Bprofiles%5D%5Btype%5D=SINGLE_ORIGIN&filter%5Bprofiles%5D%5Bgroup%5D="+local_group+"&include%5Bprofiles%5D%5B%5D=profileComponents&include%5Bprofiles%5D%5B%5D=restrictedMachines&include%5Bprofiles%5D%5B%5D=profileComponents.lots&include%5Bprofiles%5D%5B%5D=profileGroup&page%5Bsize%5D=200&page%5Bnumber%5D=0&sort%5Bprofiles%5D%5BlastModifiedDate%5D=desc"
      try {
        var resp = await local_axios({
          url: url_single_origins,
          method:"GET",
          headers:local_headers
        })

        return resp.data.data

      }
      catch(e){

        console.log(e)
        return []
      }

    }


  },
  get_green: async function(){
      //GET
      var url = "https://c-sar.cropster.com/api/v2/lots?filter%5Blots%5D%5BincludeConsumed%5D=false&filter%5Blots%5D%5Bgroup%5D="+this.group+"&filter%5Blots%5D%5BisSample%5D=false&filter%5Blots%5D%5BprocessingStep%5D%5B%5D=coffee.green&filter%5Blots%5D%5BhasLowStock%5D=false&include%5Blots%5D%5B%5D=certificates&include%5Blots%5D%5B%5D=varieties&include%5Blots%5D%5B%5D=physicalResults&include%5Blots%5D%5B%5D=sourceContacts&include%5Blots%5D%5B%5D=latestSensorialQc&include%5Blots%5D%5B%5D=latestSampleGroupSensorialQc&include%5Blots%5D%5B%5D=latestSensorialQcOfRootLots&include%5Blots%5D%5B%5D=classification&page%5Bsize%5D=200&page%5Bnumber%5D=0&sort%5Blots%5D%5BcreationDate%5D=desc"


      try {
        var resp = await this.axios({
          url: url,
          method:"GET",
          headers:this.cropster_headers
        })

        // console.log("GREEN:")
        // console.log(resp.data.data)

        return resp.data.data

      }
      catch(e){

        console.log(e)

      }
  }

}



module.exports = cropster