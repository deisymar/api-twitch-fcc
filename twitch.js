/**
 * this script uses plain native javascript DOM, to consume api use Ajax
 */

let channels = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];
let apiUrlBase = "https://twitch-proxy.freecodecamp.rocks/twitch-api/";
// https://twitch-proxy.freecodecamp.rocks/helix => no me funciona  

document.addEventListener("DOMContentLoaded", function() {  
    //select
    var x = document.getElementById("search-box");
    for (var i = 0; i < channels.length; i++) {   
        var option = document.createElement("option"); 
        option.text = channels[i];
        x.add(option);
    }   

    getDataStreams();

    document.querySelectorAll("#navbar-list li").forEach(el => {
        el.addEventListener("click", e => {            
            let statusActive = document.getElementsByClassName("active");
            for(let i=0; i<statusActive.length; i++)
            {
              statusActive[i].classList.remove("active");
            }                      
            e.target.classList.add("active");
            let statusSelector = e.currentTarget.getAttribute("id");
            let channelOnline = document.querySelectorAll(".online");
            let channelOffline = document.querySelectorAll(".offline");
            if(statusSelector === "online"){
              channelOnline.forEach( function (channelOn) {                
                channelOn.style.display  = "";               
              })
              channelOffline.forEach( function (channelOff) {                
                channelOff.style.display  = "none"; 
              })                      
            } else if(statusSelector === "offline"){ 
              channelOnline.forEach( function (channelOn) {                
                channelOn.style.display  = "none"
              })
              channelOffline.forEach( function (channelOff) {                
                channelOff.style.display  = ""; 
              })
            } else{          
              channelOnline.forEach( function (channelOn) {                
                channelOn.style.display  = ""; 
              })
              channelOffline.forEach( function (channelOff) {                
                channelOff.style.display  = "";  
              })
            }  
        });
      });  

      const btnSearch = document.getElementById("submit-button");
      btnSearch.addEventListener("click", e => {        
        const textSearch = document.getElementById("search-box").value;
        if(textSearch!==""){  
            const element = document.querySelectorAll('.nav-link');
            element.forEach(el => {
                el.classList.remove("active");
            });
                          
            document.getElementById("channels-wrapper").style.display = "none";
            document.getElementById("search-wrapper").style.display = "";
            document.getElementById("search-wrapper").innerHTML = "";     
            
            getDataChannel(textSearch, "searchChannel", "", "channel");                
          }
          else{            
            document.getElementById("channels-wrapper").style.display = "";
            document.getElementById("search-wrapper").style.display = "none";   
          }
      }); 

      function getDataChannel(channel, status, game, typeReq) {
        apiUrlChannel = apiUrlBase + "channels" + "/" + channel + "?callback=?";
        
        $.ajax({
          type: "GET",            
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          url: apiUrlChannel,
          async: false,            
          success: function(dataChannel){
            //console.log(dataChannel);                           
            let logo = dataChannel.logo !== null ? dataChannel.logo : "../image/user_logo.png";          
            let name = dataChannel.display_name !== null ? dataChannel.display_name : channel;
            let url = dataChannel.url !== null ? dataChannel.url : "#";
            let views = dataChannel.views !== null ? dataChannel.views : 0;
            let description = dataChannel.status!== null ? dataChannel.status : "";
            let htmlChannel = '<div class="row row-channel '+ status + '">'
              +'<div class="col-xs-2 col-sm-1" id="icon-channel">'
              +'<img src="' + logo + '" class="logo-channel" alt="logo channel" style="font-size: 14px"></div>'
              +'<div class="col-xs-10 col-sm-3" id="name-channel">'
              +'<a class="link-channel link-'+status+'" href="' + url + '" target="_blank">' + name + '</a></div>'
              +'<div id="streaming-channel" class="col-xs-6 col-sm-3" >'+ game +'</div>'
              +'<div id="description-channel" class="col-xs-6 col-sm-5"><span class="hidden-xs">' + description + '</span></div></div>';
            if(typeReq==="streams"){
              status === "online" ? document.getElementById("channels-wrapper").insertAdjacentHTML('beforebegin',htmlChannel) : document.getElementById("channels-wrapper").insertAdjacentHTML('afterend',htmlChannel);
            } else{           
              document.getElementById("search-wrapper").insertAdjacentHTML('afterend',htmlChannel); 
            }    
          },
          //cache: false,
          error: function(errorMessage){ console.log(errorMessage); },
          complete: function () { }
        });
        
      }
       
      function getDataStreams() {
        let game="", 
            status="",
            apiUrlStreams="";          
        
        for (i = 0; i < channels.length;++i) {
          apiUrlStreams =  apiUrlBase + "streams" + "/" + channels[i] + "?callback=?";
          let nameChannel=channels[i];

          $.ajax({
            type: "GET",            
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            url: apiUrlStreams,
            async: false,            
            success: function(dataStream){
              //console.log(dataStream);
              if(dataStream.stream===null){
                game="Offline";
                status="offline";
              }else if(dataStream.stream === 'undefined') {
                game = "Account Closed";
                status = "offline";
              }else{
                game= dataStream.stream.game;
                status = "online";
              } 
              getDataChannel(nameChannel, status, game, "streams"); 
            },
            //cache: false,
            error: function(errorMessage){ console.log(errorMessage); },
            complete: function () { }
          });
 
        }   
      }
});