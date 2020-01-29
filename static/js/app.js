d3.json("static/samples.json").then((data) => {
    let names = []

    data.names.forEach(element => {
        names.push(element)
    });

    var options = d3.select("#selDataset").selectAll("option")
        .data(names)
        .enter()
        .append("option");
    
        //Set the text and value for your options
    options.text(function (d) {
        return d;
    })
        .attr("value", function (d) {
            return d;
        });

    optionChanged(names[0])
});


function optionChanged(val){
    d3.json("static/samples.json").then((data) => {

        var otu_ids_bar = []
        var otu_ids
        var sample_values
        var otu_labels
        
        data.samples.forEach((element) => {
            if(element.id === val){
                element.otu_ids.forEach((element) => {
                    otu_ids_bar.push(`OTU ${element}`)
                })
                sample_values = element.sample_values
                otu_labels = element.otu_labels
                otu_ids = element.otu_ids
            }
        })


        data.metadata.forEach((element) => {
            if (element.id === parseInt(val)) {

                d3.select("#sample-metadata").selectAll("p").remove()
                
                var metadata = d3.select("#sample-metadata").selectAll("p")
                    .data(d3.entries(element))
                    .enter()
                    ;

                console.log(metadata)

                //Set the text and value for your options
                metadata.append("p").text(function (d) {
                    return `${d.key}: ${d.value}`
                })
            }
        })


        var trace1 = {
            x: sample_values.slice(0,10),
            y: otu_ids_bar.slice(0,10),
            orientation: 'h',
            hovertext: otu_labels.slice(0,10),
            type: 'bar',
            transforms: [{
                type: 'sort',
                target: 'y',
                order: 'descending'}]
        };

        var data = [trace1];

        var layout = {
            title: 'Top 10 OTU',
            barmode: 'stack'
        };

        Plotly.newPlot('bar', data, layout);

        var trace2 = {
            x: otu_ids,
            y: sample_values,
            mode: 'markers',
            text: otu_labels,
            marker: {
                size: sample_values,
                color: otu_ids
            }
        };

        var data2 = [trace2];

        var layout2 = {
            title: 'Samples',
            xaxis: {
                title: {
                    text: 'OTU ID'
                },
            },
            yaxis: {
                title: {
                    text: 'Sample Values',
            }}
        }

        Plotly.newPlot('bubble', data2, layout2);

     });
}