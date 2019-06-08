function generateNetwork(data, username) {
    var col = document.getElementById("col");
    var padding = parseInt(window.getComputedStyle(col, null).getPropertyValue("padding-left").replace("px",''));
    var baseDimension = col.scrollWidth - padding * 2;
    const width = baseDimension;
    const height = baseDimension - 50;
    color = function () {
        const scale = d3.scaleOrdinal(d3.schemeCategory10);
        return d => scale(d.group);
    };

    drag = simulation => {
        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }
        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }
        function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }
        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }

    const links = data.links.map(d => Object.create(d));
    const nodes = data.nodes.map(d => Object.create(d));
    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));
    const svg = d3.select("svg")
        .attr("width", width)
        .attr("height", height);
    const link = svg.append("g")
        .attr("stroke", "#23CE6B")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("class", "lines")
        .attr("stroke-width", d => Math.sqrt(d.value));
    const node = svg.append("g")
        .attr("stroke", "#f3f3f3")
        .attr("stroke-width", 1.5)
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("onclick", "location.assign('https://github.com/" + `${d => d.id}` + "')")
        .call(drag(simulation));
    node.append("title")
        .text(d => d.id);
    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);
        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    });
    svg.node();

    var circles = document.getElementsByTagName("circle");
    var i, l = circles.length;
    for (i = 0; i < l; i++) {
        if (circles[i].innerHTML == `<title>${username}</title>`) {
            circles[i].setAttribute("style", "fill:#f57900;r:5;");
        }
        var title = circles[i].getElementsByTagName("title")[0].innerHTML;
        circles[i].setAttribute("onclick", `location.assign('https://github.com/${title}')`);
    }
}

function getResult(username) {
    var submitBtn = document.getElementById("submit");
    submitBtn.disabled = true;
    submitBtn.innerHTML = "Fetching...";
    submitBtn.classList.add("disabled");

    var url = "github.php?username=" + username;
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function () {
        if (ajax.readyState == 4 && ajax.status == 200) {
            var response = JSON.parse(ajax.responseText);
            submitBtn.disabled = false;
            submitBtn.innerHTML = "Generate";
            submitBtn.classList.remove("disabled");
            var statusBlock = document.querySelector("#statusBlock");
            statusBlock.innerHTML = response.message;
            switch (response.status) {
                case "negative":
                    statusBlock.setAttribute("class", "small text-danger");
                    break;
                case "positive":
                    statusBlock.setAttribute("class", "small text-primary");
                    data = response.data;
                    var svgMain = document.getElementsByTagName("svg")[0];
                    svgMain.innerHTML = "";
                    generateNetwork(data, username);
                    
                    var circles = document.getElementsByTagName("circle");
                    var i, l = circles.length;
                    for (i = 0; i < l; i++) {
                        if (circles[i].innerHTML == `<title>${username}</title>`) {
                            circles[i].setAttribute("style", "fill:#f57900;r:5;");
                        }
                        var title = circles[i].getElementsByTagName("title")[0].innerHTML;
                        circles[i].setAttribute("onclick", `location.assign('https://github.com/${title}')`);
                    }
                    break;
            }
        }
    };
    ajax.open("GET", url);
    ajax.send();
}

var demoData = {
    "nodes": [
        {
            "id": "master",
            "group": 1
        },
        {
            "id": "b",
            "group": 1
        },
        {
            "id": "c",
            "group": 1
        },
        {
            "id": "d",
            "group": 1
        },
        {
            "id": "e",
            "group": 1
        },
        {
            "id": "f",
            "group": 1
        },
        {
            "id": "g",
            "group": 1
        },
        {
            "id": "h",
            "group": 1
        },
        {
            "id": "i",
            "group": 1
        },
        {
            "id": "j",
            "group": 1
        },
        {
            "id": "k",
            "group": 1
        },
        {
            "id": "l",
            "group": 1
        },
        {
            "id": "m",
            "group": 1
        }
    ],
    "links": [
        {
            "source": "master",
            "target": "b",
            "value": 1
        },
        {
            "source": "master",
            "target": "c",
            "value": 1
        },
        {
            "source": "master",
            "target": "d",
            "value": 1
        },
        {
            "source": "master",
            "target": "e",
            "value": 1
        },
        {
            "source": "master",
            "target": "f",
            "value": 1
        },
        {
            "source": "master",
            "target": "g",
            "value": 1
        },
        {
            "source": "g",
            "target": "d",
            "value": 1
        },
        {
            "source": "g",
            "target": "f",
            "value": 1
        },
        {
            "source": "g",
            "target": "c",
            "value": 1
        },
        {
            "source": "g",
            "target": "master",
            "value": 1
        },
        {
            "source": "g",
            "target": "h",
            "value": 1
        },
        {
            "source": "f",
            "target": "i",
            "value": 1
        },
        {
            "source": "f",
            "target": "h",
            "value": 1
        },
        {
            "source": "f",
            "target": "c",
            "value": 1
        },
        {
            "source": "f",
            "target": "d",
            "value": 1
        },
        {
            "source": "f",
            "target": "g",
            "value": 1
        },
        {
            "source": "f",
            "target": "e",
            "value": 1
        },
        {
            "source": "f",
            "target": "master",
            "value": 1
        },
        {
            "source": "d",
            "target": "g",
            "value": 1
        },
        {
            "source": "d",
            "target": "c",
            "value": 1
        },
        {
            "source": "d",
            "target": "f",
            "value": 1
        },
        {
            "source": "d",
            "target": "j",
            "value": 1
        },
        {
            "source": "c",
            "target": "f",
            "value": 1
        },
        {
            "source": "c",
            "target": "k",
            "value": 1
        },
        {
            "source": "c",
            "target": "master",
            "value": 1
        },
        {
            "source": "c",
            "target": "d",
            "value": 1
        },
        {
            "source": "c",
            "target": "g",
            "value": 1
        },
        {
            "source": "c",
            "target": "l",
            "value": 1
        },
        {
            "source": "c",
            "target": "m",
            "value": 1
        },
        {
            "source": "b",
            "target": "master",
            "value": 1
        }
    ]
};
generateNetwork(demoData, 'master');
