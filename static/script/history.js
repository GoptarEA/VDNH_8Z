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

    document.getElementById("routes_list_history").addEventListener("click", async (elem) => {
        var routeinfo;
        if (elem.target.id === "route_info_history") {
            routeinfo = elem.target.parentElement;
        } else if (elem.target.id === "route_info_container_history") {
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
                document.getElementById("map_image_history").src="https://static-maps.yandex.ru/1.x/?l=map&pl=" + s.slice(0, -1);
                document.getElementById("start_history").innerHTML = start;
                document.getElementById("finish_history").innerHTML = finish;
                document.getElementById("time_history").innerHTML = await multiRoute.getActiveRoute().properties.get("duration").text;;
                document.getElementById("length_history").innerHTML = await multiRoute.getActiveRoute().properties.get("distance").text;

                document.getElementById("aboute_route_history").style.display = "block";
                document.getElementById("central_block_hist").style.display = "block";
                document.getElementById("nothing_history").style.display = "none";

            });
            console.log(start);
            console.log(finish);
        }
    });

    document.getElementById("create_time_route_history").addEventListener("click", async () => {
        myMap.geoObjects.removeAll();
        var start = Coords.pointCoords([document.getElementById("start_history").innerHTML]);
        var finish = Coords.pointCoords([document.getElementById("finish_history").innerHTML]);
        var multiRoute = await getNewRoute(start[0], finish[0]);
        console.log(multiRoute);
        myMap.geoObjects.add(multiRoute);
        document.getElementById("aboute_route_history").style.display = "none";
        document.getElementById("central_block_hist").style.display = "none";
        document.getElementById("nothing_history").style.display = "block";
    });


    var myMap = new ymaps.Map("map_history", {
        center: [55.831054, 37.629914],
        zoom: 15
        }, {
            restrictMapArea: [[55.843203, 37.608155], [55.821900, 37.654070]]
        });

    ['zoomControl', 'searchControl', 'rulerControl',
    'typeSelector', 'fullscreenControl', 'trafficControl'].forEach(elem => myMap.controls.remove(elem));

}

document.getElementById("close_aboute_route_history").addEventListener("click", () => {
    document.getElementById("aboute_route_history").style.display = "none";
    document.getElementById("central_block_hist").style.display = "none";
    document.getElementById("nothing_history").style.display = "block";
});