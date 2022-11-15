/** this script use jquery javascript, to consume api use jquery getJson  */

let channels = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];
let apiUrlBase = "https://twitch-proxy.freecodecamp.rocks/twitch-api/";
// https://twitch-proxy.freecodecamp.rocks/helix => no me funciona  

function getDataChannel(channel, status, game, typeReq) {
  apiUrlChannel = apiUrlBase + "channels" + "/" + channel + "?callback=?";

  $.getJSON(apiUrlChannel, function(dataChannel){
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
      status === "online" ? $("#channels-wrapper").prepend(htmlChannel) : $("#channels-wrapper").append(htmlChannel);
    } else{
      $("#search-wrapper").append(htmlChannel); 
    }    
  });
}

function getDataStreams() {     
   
  channels.forEach(function(channel) { 
     let game="", 
         status="";

    let apiUrlStreams =  apiUrlBase + "streams" + "/" + channel + "?callback=?";
    $.getJSON(apiUrlStreams, function(dataStream){        
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
      
      getDataChannel(channel, status, game, "streams");           
    }); 
  })    
}

$(document).ready(function() {   
  //Select Channel
  for (var i = 0; i < channels.length; i++) {   
    var option = document.createElement("option"); 
    $(option).html(channels[i]); 
    $(option).appendTo("#search-box");
  }
  
  $(document).ajaxStart(function () {
    $("#loading-image").show();
  });

  $(document).ajaxStop(function () {
    $("#loading-image").hide();
  });

  getDataStreams();
  
  $("#navbar-list li").click(function () {
      $("#channels-wrapper").show();
      $("#search-wrapper").hide();
          
      $("ul li").removeClass("active");
      $(this).addClass("active");
      let statusSelector = $(this).attr("id");
      if(statusSelector === "online"){
        $(".online").show();
        $(".offline").hide(); 
      } else if(statusSelector === "offline"){   
          $(".online").hide();
          $(".offline").show();
        } else{          
          $(".online").show();
          $(".offline").show();
        }
  }); 
  //input search
  /*$("#search-box").on("keyup", function (e) {
    $("#search-box").autocomplete({
      source: channels
    });
  }).on("keypress", function (e){
    if(e.which == 13){
      $("#submit-button").click();
    }
  });*/  

  $("#submit-button").click(function(e){    
          
    if($("#search-box").val()!==""){
      let textSearch=$("#search-box").val();      
      $("ul li").removeClass("active");      
      $("#search-wrapper").html(""); 
      $("#channels-wrapper").hide();
      $("#search-wrapper").show();
      getDataChannel(textSearch, "searchChannel", "", "channel");      
    }
    else{
      $("#channels-wrapper").show();
      $("#search-wrapper").hide();
    }
  });
});