var fileDragover = function fileDragover(e){
  e.stopPropagation();
  e.preventDefault();
  $(this).addClass('well-active');
}

var fileDragleave = function fileDragleave(e){
  e.stopPropagation();
  e.preventDefault();
  $(this).removeClass('well-active');
}

var fileDrop = function fileDrop(e){
  e.stopPropagation();
  e.preventDefault();
  $(this).removeClass('well-active');

  var $well = $(this);
  var $filename = $well.find('.js-file-name');

  var files = e.originalEvent.dataTransfer.files;
  var reader = new FileReader();

  reader.addEventListener("load", function(){
    getDataFromCSV(reader.result, function(data){
      // renderTable(data);
      getDimensionsFromData(data, function(dimensions){
        renderGraphs(dimensions);
      });
    })
  }, false);

  if(/^text[/]/.test(files[0].type)){
    $filename.text(files[0].name);
    $well.addClass('well-full');
    reader.readAsText(files[0]);
  } else {
    $filename.text('Drop Google Analytics CSV here');
    $well.removeClass('well-full');
  }
}

var getDataFromCSV = function getDataFromCSV(csvString, done){
  Papa.parse(csvString, {
    comments: '#',
    header: true,
    skipEmptyLines: true,
    complete: function(results){
      var data = _.filter(results.data, function(row){
        return (
          _.size(row) === results.meta.fields.length
        ) && (
          'Screen Resolution' in row
        ) && (
          row['Screen Resolution'] !== ''
        ) && (
          row['Screen Resolution'] !== '(not set)'
        );
      });
      done(data);
    }
  });
}

var getDimensionsFromData = function getDimensionsFromData(data, done){
  done(_.map(data, function(row){
    var widthAndHeight = row['Screen Resolution'].split('x');
    if(widthAndHeight.length === 2){
      return {
        'width': parseInt(widthAndHeight[0]),
        'height': parseInt(widthAndHeight[1]),
        'sessions': parseInt(row['Sessions'].replace(',', ''))
      }
    } else {
      debugger;
    }
  }));
}

var renderTable = function renderTable(rows){
  var $table = $('<table>').addClass('table table-condensed table-hover');
  var $thead = $('<thead>').appendTo($table);
  var $thead_tr = $('<tr>').appendTo($thead);
  _.each(_.keys(rows[0]), function(header){
    $('<th>').text(header).appendTo($thead_tr);
  });

  var $tbody = $('<tbody>').appendTo($table);
  _.each(rows, function(rowCells){
    var $tr = $('<tr>').appendTo($tbody);
    _.each(rowCells, function(value){
      $('<td>').text(value).appendTo($tr);
    });
  });

  $('.js-data').show().html($table);

  $table.stickyTableHeaders({
    scrollableArea: $('.js-data')
  });
}

var renderGraphs = function renderGraphs(dimensions){
  var points = [];
  var runningTotal = 0;
  var lastWidth;

  _.each(_.sortBy(dimensions, 'width'), function(obj){
    if(obj.width === lastWidth){
      _.last(points).y += obj.sessions;
    } else {
      points.push({
        'x': obj.width,
        'y': runningTotal + obj.sessions
      });
    }
    runningTotal += obj.sessions;
    lastWidth = obj.width;
  });

  $('.js-graphs').empty();

  var widthsCanvas = $('<canvas>').attr({
    width: 800,
    height: 400
  }).appendTo('.js-graphs');
  var widthsChart = new Chart(widthsCanvas[0].getContext('2d'), {
    type: 'line',
    data: {
      datasets: [{
        label: 'Sessions with screen at least X pixels wide',
        data: points
      }]
    },
    options: {
      animation: false,
      tooltips: {
        mode: 'x-axis'
      },
      hover: {
        mode: 'x-axis'
      },
      scales: {
        xAxes: [{
          type: 'linear',
          position: 'bottom',
          ticks: {
            max: 2560,
            fixedStepSize: 320
          },
          scaleLabel: {
            display: true,
            labelString: 'Width (px)'
          }
        }],
        yAxes: [{
          type: 'linear',
          position: 'left',
          scaleLabel: {
            display: true,
            labelString: 'Sessions'
          }
        }]
      }
    }
  });
}

$(function(){

  $('.js-drop-file')
    .on('dragover', fileDragover)
    .on('dragleave', fileDragleave)
    .on('drop', fileDrop);

});
