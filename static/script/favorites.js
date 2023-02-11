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

    document.getElementById("routes_list_fav").addEventListener("click", async (elem) => {
        var routeinfo;
        if (elem.target.id === "route_info_fav") {
            routeinfo = elem.target.parentElement;
        } else if (elem.target.id === "route_info_container_fav") {
            routeinfo = elem.target;
        }

        if (routeinfo !== undefined) {
            var start = routeinfo.childNodes[3].innerHTML.split(": ")[1];
            var finish = routeinfo.childNodes[5].innerHTML.split(": ")[1];
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
                document.getElementById("map_image_fav").src="https://static-maps.yandex.ru/1.x/?l=map&pl=" + s.slice(0, -1);
                document.getElementById("start_fav").innerHTML = start;
                document.getElementById("finish_fav").innerHTML = finish;
                document.getElementById("time_fav").innerHTML = await multiRoute.getActiveRoute().properties.get("duration").text;;
                document.getElementById("length_fav").innerHTML = await multiRoute.getActiveRoute().properties.get("distance").text;

                document.getElementById("aboute_route_fav").style.display = "block";
                document.getElementById("central_block").style.display = "block";
                document.getElementById("nothing_fav").style.display = "none";

            });
            console.log(start);
            console.log(finish);
        }
    });

    document.getElementById("create_time_route_fav").addEventListener("click", async () => {
        myMap.geoObjects.removeAll();
        var start = Coords.pointCoords([document.getElementById("start_fav").innerHTML]);
        var finish = Coords.pointCoords([document.getElementById("finish_fav").innerHTML]);
        var multiRoute = await getNewRoute(start[0], finish[0]);
        console.log(multiRoute);
        myMap.geoObjects.add(multiRoute);
        document.getElementById("aboute_route_fav").style.display = "none";
        document.getElementById("central_block").style.display = "none";
        document.getElementById("nothing_fav").style.display = "block";
    });


    var myMap = new ymaps.Map("map_favorites", {
        center: [55.831054, 37.629914],
        zoom: 15
        }, {
            restrictMapArea: [[55.843203, 37.608155], [55.821900, 37.654070]]
        });

    ['zoomControl', 'searchControl', 'rulerControl',
    'typeSelector', 'fullscreenControl', 'trafficControl'].forEach(elem => myMap.controls.remove(elem));

    new ymaps.SuggestView(document.getElementById("change_start_point"), {provider: provider, results: 10, offset: [-720, -480]});
    new ymaps.SuggestView(document.getElementById("change_finish_point"), {provider: provider, results: 10, offset: [-720, -480]});


}

document.getElementById("close_aboute_route_fav").addEventListener("click", () => {
    document.getElementById("aboute_route_fav").style.display = "none";
    document.getElementById("central_block").style.display = "none";
    document.getElementById("nothing_fav").style.display = "block";
});


Array.from(document.getElementsByClassName("route_settings")).forEach((elem) => {
    elem.addEventListener("click", (el) => {
        if (el.target.id === "route_settings") {
            document.getElementById("opened_win_settings").style.display = "block";
            document.getElementById("delete_btn").addEventListener("click", () => {
                var p1 = elem.parentElement.childNodes[3].innerHTML.split(": ")[1];
                var p2 = elem.parentElement.childNodes[5].innerHTML.split(": ")[1];
                $.getJSON($SCRIPT_ROOT + '/delete_favorite', {
                    pnts: p1 + "," + p2
                });
                $(elem.parentElement).remove();
                document.getElementById("opened_win_settings").style.display = "none";
                document.getElementById("change_start_point").value = "";
                document.getElementById("change_finish_point").value = "";
            });
            document.getElementById("change_btn").addEventListener("click", () => {
                var p1 = elem.parentElement.childNodes[3].innerHTML.split(": ")[1];
                var p2 = elem.parentElement.childNodes[5].innerHTML.split(": ")[1];
                var new1 = document.getElementById("change_start_point").value;
                var new2 = document.getElementById("change_finish_point").value;
                if (new1 + new2 === "") {
                    alert("Вы не указали точки для изменения")
                } else if (new1 === "") {
                    elem.parentElement.childNodes[5].innerHTML = "Финиш: " + new2;
                    $.getJSON($SCRIPT_ROOT + '/change_favorite', {
                        pnts: p1 + "," + p2,
                        newpnts: "," + new2
                    });

                    document.getElementById("opened_win_settings").style.display = "none";
                    document.getElementById("change_start_point").value = "";
                    document.getElementById("change_finish_point").value = "";
                } else if (new2 === "") {
                    elem.parentElement.childNodes[3].innerHTML = "Старт: " + new1;
                    $.getJSON($SCRIPT_ROOT + '/change_favorite', {
                        pnts: p1 + "," + p2,
                        newpnts: new1 + ","
                    });

                    document.getElementById("opened_win_settings").style.display = "none";
                    document.getElementById("change_start_point").value = "";
                    document.getElementById("change_finish_point").value = "";
                } else {
                    elem.parentElement.childNodes[3].innerHTML = "Старт: " + new1;
                    elem.parentElement.childNodes[5].innerHTML = "Финиш: " + new2;
                    $.getJSON($SCRIPT_ROOT + '/change_favorite', {
                        pnts: p1 + "," + p2,
                        newpnts: new1 + "," + new2
                    });

                    document.getElementById("opened_win_settings").style.display = "none";
                    document.getElementById("change_start_point").value = "";
                    document.getElementById("change_finish_point").value = "";
                }
            });
        }
    })
});

document.getElementById("opened_win_settings").addEventListener("click", (arg) => {
    if (arg.target.id === "opened_win_settings") {
        document.getElementById("opened_win_settings").style.display = "none";
        document.getElementById("change_start_point").value = "";
        document.getElementById("change_finish_point").value = "";
    }
});