function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array.
    var samples = data.samples;

    console.log(data)

    // 4. Create a variable that filters the samples for the object with the desired sample number.

    let resArray = samples.filter(sampleObj => sampleObj.id == sample);

    //  5. Create a variable that holds the first sample in the array.

    let resul = resArray[0];

    console.log(samples)


    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.


        // 7. Create the yticks for the bar chart.
    console.log(resul)

    var otuLab = resul["otu_labels"].map(a => a).slice(0, 10).reverse();

    var sampleValues = resul["sample_values"].map(a => a).slice(0, 10).reverse();

    var otuID = resul["otu_ids"].map(a => "OTU " + a).slice(0, 10).reverse();

    console.log(otuLab)

    console.log(sampleValues)

    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x : sampleValues,
      y : otuID,
      text : otuLab,
      type : "bar",
      orientation : "h"
      
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
     title : "Top 10 Bacteria Cultures Found",

    };

    // 10. Use Plotly to plot the data with the layout. 

    Plotly.newPlot("bar", barData, barLayout);

    // 1. Create the trace for the bubble chart.

    var bubbleData = [{
      x : resul["otu_ids"],
      y : resul["sample_values"],
      text : resul["otu_labels"],
      mode : "markers",
      marker : {
        size : resul["sample_values"],
        color : resul["otu_ids"],
      },
      hovermode : "closest"

    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title : "Bacteria Cultures Per Sample",
      xaxis : {
        title : "OTU ID"
      },

    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

    // 4. Create the trace for the gauge chart.

    // 1. Create a variable that filters the metadata array for the object with the desired sample number and holds first sample.
    var gauge = data.metadata;

    let gaugeArray = gauge.filter(metaObj => metaObj.id == sample)[0];

    // 3. Create a variable that holds the washing frequency.

    wsh = gaugeArray.wfreq

    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      value : wsh,
      type : "indicator",
      mode : "gauge+number",
      title: { text: "Belly Button Washing Frequency", font: { size: 24 } },
      gauge : {
        bar: { color: "black" },
        axis : {
          range: [null, 10]
        },
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "lightgreen" },
          { range: [8, 10], color: "green" }
        ]},     
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
     
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);


  });
}

    

