ymaps.ready(init);

function init(){

    function addPointsOnMap(arrofpoints) {
        myMap.geoObjects.removeAll();
        if (arrofpoints.size === 1) {
            myMap.geoObjects.add(new ymaps.Placemark(arrofpoints.entries().next().value[1], {
                balloonContent: '<strong>' + arrofpoints.entries().next().value[0] + '</strong>',
            }, {
                preset: 'islands#blueCircleDotIconWithCaption',
                iconCaptionMaxWidth: '50',
            }));
            myMap.setCenter(arrofpoints.entries().next().value[1], 18, {
                checkZoomRange: true
            });  
        } else {
            for (const [key, value] of arrofpoints) {
                myMap.geoObjects.add(new ymaps.Placemark([value[0], value[1]], {
                    balloonContent: '<strong>' + key + '</strong>',
                }, {
                    preset: 'islands#blueCircleDotIconWithCaption',
                    iconCaptionMaxWidth: '50'
                }));
                myMap.setCenter([55.831054, 37.629914], 15, {
                    checkZoomRange: true
                });   
            }
        }
    }

    async function addRouteOnMap(arrofpoints) {
        myMap.geoObjects.removeAll();
        multiRoute = new ymaps.multiRouter.MultiRoute({
            referencePoints: arrofpoints,
            params: {
                routingMode: 'pedestrian'
            }
        }, {
            boundsAutoApply: true
        });
        return multiRoute;
    }



    var myMap = new ymaps.Map("map", {
        center: [55.831054, 37.629914],
        zoom: 15
        }, {
            restrictMapArea: [[55.843203, 37.608155], [55.821900, 37.654070]]
        });
    
    ['zoomControl', 'searchControl', 'rulerControl',
    'typeSelector', 'fullscreenControl', 'trafficControl'].forEach(elem => myMap.controls.remove(elem));

    new ymaps.SuggestView(document.getElementById("points_search"), {provider: provider, results: 10});
    Array.from(document.getElementsByClassName("point_input")).forEach((elem) => {
        new ymaps.SuggestView(elem, {provider: provider, results: 10});
    });

    document.getElementById("search_menu").addEventListener("click", (e) => {
        if (e.target.id === "search_menu") {
            addPointsOnMap(new Map([[document.getElementById("points_search").value, 
            Coords.pointCoords([document.getElementById("points_search").value])[0]]]));
            document.getElementById("points_search").value = "";
            }
    });

    document.getElementById("allPOI").addEventListener("click", () => addPointsOnMap(dict));
    document.getElementById("clear_map").addEventListener("click", () =>  myMap.geoObjects.removeAll());
    document.getElementById("rests").addEventListener("click", () => { [myMap.geoObjects.removeAll(), addPointsOnMap(rests)] });
    document.getElementById("museums").addEventListener("click", () => { [myMap.geoObjects.removeAll(), addPointsOnMap(museums)] });
    document.getElementById("arc").addEventListener("click", async () => { 
        var multiRoute = await addRouteOnMap([[55.822281, 37.641289], [55.826296, 37.637650]]);
        multiRoute.options.set({
            wayPointStartIconFillColor: "blue",
            wayPointFinishIconFillColor: "blue", 
            routeActiveStrokeWidth: 6,
            routeActivePedestrianSegmentStrokeStyle: "solid",
            routeActivePedestrianSegmentStrokeColor: "#0A0A0A"
          });
          myMap.geoObjects.add(multiRoute);   
    });

    document.getElementById("pav1").addEventListener("click", async () => { 
        var multiRoute = await addRouteOnMap([[55.822281, 37.641289], [55.828578, 37.633840]]);
        multiRoute.options.set({
            wayPointStartIconFillColor: "blue",
            wayPointFinishIconFillColor: "blue", 
            routeActiveStrokeWidth: 6,
            routeActivePedestrianSegmentStrokeStyle: "solid",
            routeActivePedestrianSegmentStrokeColor: "#0A0A0A"
          });
          myMap.geoObjects.add(multiRoute);   
    });

    document.getElementById("moskvarium").addEventListener("click", async () => { 
        var multiRoute = await addRouteOnMap([[55.822281, 37.641289], [55.832775, 37.618508]]);
        multiRoute.options.set({
            wayPointStartIconFillColor: "blue",
            wayPointFinishIconFillColor: "blue", 
            routeActiveStrokeWidth: 6,
            routeActivePedestrianSegmentStrokeStyle: "solid",
            routeActivePedestrianSegmentStrokeColor: "#0A0A0A"
          });
          myMap.geoObjects.add(multiRoute);   
    });
}


let slideWins = 
    [
        ["static_button", "static_content"],
        ["dynamic_button", "dynamic_content"],
        ["time_button", "time_content"],
        ["favorites_button", "favorites_content"],
        ["history_button", "history_content"]
    ];

slideWins.forEach(elem => {
    document.getElementById(elem[0]).addEventListener("click", () => {
        document.getElementById(elem[0]).style.setProperty('--checked-width', "100%");
        document.getElementById(elem[0]).style.setProperty('--checked-left', "0");
        document.getElementById(elem[0]).style.setProperty('color', "black");
        for (let ind = 0; ind < 5; ind++){
            if (window.getComputedStyle(document.getElementById(slideWins[ind][1])).display === "grid" && 
            elem[0] !== slideWins[ind][0]) {
                document.getElementById(slideWins[ind][1]).classList.add("class_out_animation");
                document.getElementById(slideWins[ind][0]).style.setProperty('--checked-width', "0%");
                document.getElementById(slideWins[ind][0]).style.setProperty('--checked-left', "50");
                document.getElementById(slideWins[ind][0]).style.setProperty('color', "rgba(0, 0, 0, 0.644)");
                setTimeout(function() {
                    document.getElementById(slideWins[ind][1]).style.display = "none";
                    document.getElementById(slideWins[ind][1]).classList.remove("class_out_animation");
                }, 250);
                document.getElementById(elem[1]).style.display = "grid";
                document.getElementById(elem[1]).classList.add("class_in_animation");
                setTimeout(function() {
                    document.getElementById(elem[1]).classList.remove("class_in_animation");
                }, 250);
                break;
            };
        };
    });
});


