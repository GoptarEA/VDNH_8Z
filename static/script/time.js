ymaps.ready(init);

function init(){

    async function getNewRoute(point1, point2) {
        return new ymaps.multiRouter.MultiRoute({
            referencePoints: [
                point1,
                point2
            ],
            params: {
                routingMode: 'pedestrian'
            }
        }, {
            boundsAutoApply: true
        });
    }


    async function addNewRoute(multiRoute, key, start, time) {
        multiRoute.model.events.add('requestsuccess', async () => {
            var activeRouteTime = await multiRoute.getActiveRoute().properties.get("duration").text;
            const div = document.querySelector('div#routes_list');
            const t = document.querySelector("#route_template");
            const p = t.content.querySelectorAll("#route_info");
            if (parseInt(activeRouteTime) <= time && key !== start) {
                p[0].textContent = "Старт: " + String(start);
                p[1].textContent = "Финиш: " + String(key);
                p[2].textContent = "Время: " + String(activeRouteTime);
                div.append(t.content.cloneNode(true));
            }
        }
    )};


    document.getElementById("routes_list").addEventListener("click", async (elem) => {
        var routeinfo;
        if (elem.target.id === "route_info") {
            routeinfo = elem.target.parentElement;
        } else if (elem.target.id === "route_info_container") {
            routeinfo = elem.target;
        }

        if (routeinfo !== undefined) {
            var start = routeinfo.childNodes[1].innerHTML.split(": ")[1];
            var finish = routeinfo.childNodes[3].innerHTML.split(": ")[1];
            var multiRoute = await getNewRoute(Coords.pointCoords([start])[0], Coords.pointCoords([finish])[0]);
            multiRoute.model.events.add('requestsuccess', async () => {
                var a = await multiRoute.getActiveRoute().getPaths();
                let s = "";
                a.each(function(path) {
                    let a1 = Array.from(path.properties.get('coordinates')) 
                    for (let i = 0; i < a1.length; i += 1) {
                            s += String(a1[i][1]).split(".")[0] + "." + String(a1[i][1]).split(".")[1] + "," +
                            String(a1[i][0]).split(".")[0] + "." + String(a1[i][0]).split(".")[1] + ",";
                    }
                });
                document.getElementById("map_image").src="https://static-maps.yandex.ru/1.x/?l=map&pl=" + s.slice(0, -1);
                document.getElementById("start").innerHTML = start;
                document.getElementById("finish").innerHTML = finish;
                document.getElementById("time").innerHTML = await multiRoute.getActiveRoute().properties.get("duration").text;;
                document.getElementById("length").innerHTML = await multiRoute.getActiveRoute().properties.get("distance").text;
                
                document.getElementById("aboute_route").style.display = "block";
                document.getElementById("nothing").style.display = "none";

            });
            console.log(start);
            console.log(finish);
        }
    });

    var myMap = new ymaps.Map("map_time", {
        center: [55.831054, 37.629914],
        zoom: 15
        }, {
            restrictMapArea: [[55.843203, 37.608155], [55.821900, 37.654070]]
        });
    
    ['zoomControl', 'searchControl', 'rulerControl',
    'typeSelector', 'fullscreenControl', 'trafficControl'].forEach(elem => myMap.controls.remove(elem));

    new ymaps.SuggestView(document.getElementById("onepoint_input"), {provider: provider, results: 10});


    document.getElementById("search_routes").addEventListener("click", async () => {
        document.getElementById("opened_win").style.display = "block";
        var time = parseInt(document.getElementById("time_input").value.split(":")[0]) * 60 + 
        parseInt(document.getElementById("time_input").value.split(":")[1]);
        var start = document.getElementById("onepoint_input").value;
        var startcoords = Coords.pointCoords([document.getElementById("onepoint_input").value]);
        for (const [key, value] of dict) {
            var multiRoute = await getNewRoute(startcoords[0], value);
            console.log(startcoords[0], value);
            await addNewRoute(multiRoute, key, start, time);
        }
        document.getElementById("time_input").value = "";
        document.getElementById("onepoint_input").value = "";

    });


    document.getElementById("create_time_route").addEventListener("click", async () => {
        myMap.geoObjects.removeAll();
        var start = Coords.pointCoords([document.getElementById("start").innerHTML]);
        var finish = Coords.pointCoords([document.getElementById("finish").innerHTML]);
        var multiRoute = await getNewRoute(start[0], finish[0]);
        console.log(multiRoute);
        myMap.geoObjects.add(multiRoute);
        document.getElementById("opened_win").style.display = "none";
        document.getElementById("routes_list").childNodes.forEach(elem => {
            if (elem.id === "route_info_container") {
                elem.remove();
            }
        });
        document.getElementById("aboute_route").style.display = "none";
        document.getElementById("nothing").style.display = "block";  
    });
}

document.getElementById("opened_win").addEventListener("click", (e) => {
    if (e.target.id === "opened_win") {
        document.getElementById("opened_win").style.display = "none";
        document.getElementById("routes_list").childNodes.forEach(elem => {
            if (elem.id === "route_info_container") {
                elem.remove();
            }
        });
        document.getElementById("aboute_route").style.display = "none";
        document.getElementById("nothing").style.display = "block";
    }
});

document.getElementById("close_aboute_route").addEventListener("click", () => {
    document.getElementById("aboute_route").style.display = "none";
    document.getElementById("nothing").style.display = "block";
});

$(function() {
    $("#to_favorites_time").bind("click", function () {
        var start = $(document.getElementById("start")).html();
        var finish = $(document.getElementById("finish")).html();
        console.log(start, finish);
        $.getJSON($SCRIPT_ROOT + '/favorites', {
            start: start,
            finish: finish
            });
    });
    $("#create_time_route").bind("click", function () {
        var start = $(document.getElementById("start")).html();
        var finish = $(document.getElementById("finish")).html();
        console.log(start, finish);
        $.getJSON($SCRIPT_ROOT + '/history', {
            start: start,
            finish: finish
            });
    });
});


