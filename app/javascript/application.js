// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"
import jquery from "jquery"
//= require jquery3
//= require jquery_ujs
//= require jquery_nested_form
//= require_tree .
window.$ = jquery

// gem nested_formの記述
$(function () {
  window.NestedFormEvents = function() {
    this.addFields = $.proxy(this.addFields, this);
    this.removeFields = $.proxy(this.removeFields, this);
  };

  NestedFormEvents.prototype = {
    addFields: function(e) {
      // Setup
      var link      = e.currentTarget;
      var assoc     = $(link).data('association');                // Name of child
      var blueprint = $('#' + $(link).data('blueprint-id'));
      var content   = blueprint.data('blueprint');                // Fields template

      // Make the context correct by replacing <parents> with the generated ID
      // of each of the parent objects
      var context = ($(link).closest('.fields').closestChild('input, textarea, select').eq(0).attr('name') || '').replace(/\[[a-z_]+\]$/, '');

      // If the parent has no inputs we need to strip off the last pair
      var current = content.match(new RegExp('\\[([a-z_]+)\\]\\[new_' + assoc + '\\]'));
      if (current) {
        context = context.replace(new RegExp('\\[' + current[1] + '\\]\\[(new_)?\\d+\\]$'), '');
      }

      // context will be something like this for a brand new form:
      // project[tasks_attributes][1255929127459][assignments_attributes][1255929128105]
      // or for an edit form:
      // project[tasks_attributes][0][assignments_attributes][1]
      if (context) {
        var parentNames = context.match(/[a-z_]+_attributes(?=\]\[(new_)?\d+\])/g) || [];
        var parentIds   = context.match(/[0-9]+/g) || [];

        for(var i = 0; i < parentNames.length; i++) {
          if(parentIds[i]) {
            content = content.replace(
              new RegExp('(_' + parentNames[i] + ')_.+?_', 'g'),
              '$1_' + parentIds[i] + '_');

            content = content.replace(
              new RegExp('(\\[' + parentNames[i] + '\\])\\[.+?\\]', 'g'),
              '$1[' + parentIds[i] + ']');
          }
        }
      }

      // Make a unique ID for the new child
      var regexp  = new RegExp('new_' + assoc, 'g');
      var new_id  = this.newId();
      content     = $.trim(content.replace(regexp, new_id));

      var field = this.insertFields(content, assoc, link);
      // bubble up event upto document (through form)
      field
        .trigger({ type: 'nested:fieldAdded', field: field })
        .trigger({ type: 'nested:fieldAdded:' + assoc, field: field });
      return false;
    },
    newId: function() {
      return new Date().getTime();
    },
    insertFields: function(content, assoc, link) {
      var target = $(link).data('target');
      if (target) {
        return $(content).appendTo($(target));
      } else {
        return $(content).insertBefore(link);
      }
    },
    removeFields: function(e) {
      var $link = $(e.currentTarget),
          assoc = $link.data('association'); // Name of child to be removed
      
      var hiddenField = $link.prev('input[type=hidden]');
      hiddenField.val('1');
      
      var field = $link.closest('.fields');
      field.hide();
      
      field
        .trigger({ type: 'nested:fieldRemoved', field: field })
        .trigger({ type: 'nested:fieldRemoved:' + assoc, field: field });
      return false;
    }
  };

  window.nestedFormEvents = new NestedFormEvents();
  $(document)
    .delegate('form a.add_nested_fields',    'click', nestedFormEvents.addFields)
    .delegate('form a.remove_nested_fields', 'click', nestedFormEvents.removeFields);
});


$(function () {
        $.fn.closestChild = function(selector) {
                // breadth first search for the first matched node
                if (selector && selector != '') {
                        var queue = [];
                        queue.push(this);
                        while(queue.length > 0) {
                                var node = queue.shift();
                                var children = node.children();
                                for(var i = 0; i < children.length; ++i) {
                                        var child = $(children[i]);
                                        if (child.is(selector)) {
                                                return child; //well, we found one
                                        }
                                        queue.push(child);
                                }
                        }
                }
                return $();//nothing found
        };
});

// will_paginationにclassを当てる
document.addEventListener('DOMContentLoaded', function() {
  const paginationItems = document.querySelectorAll('.pagination li');
  const paginationItemslinks = document.querySelectorAll('.pagination li a');
  paginationItems.forEach(item => {
    // ここで追加のクラスを付与
    item.classList.add('page-item');
  });
  paginationItemslinks.forEach(item => {
    // ここで追加のクラスを付与
    item.classList.add('page-link');
  });
});

// article投稿フォームのtag選択機能
  const tagInput = document.getElementById('tag-input')
  const addButton = document.getElementById('add-button')
  const tagList = document.getElementById('tag-list')
  let tagHiddenInputs = document.querySelectorAll('.hidden-tags')
  let deleteButtons = document.getElementsByClassName('remove_nested_fields')
  let tagPills = document.getElementsByClassName('tag-pill')
  let fields = document.querySelectorAll('.fields')
  let destroys = getHiddenInputs();

  const tagHiddenInputsValues = Array.from(tagHiddenInputs).map(input => input.value.trim());

  const tagPillsValues = Array.from(tagPills).map(tagPill => tagPill.textContent.trim());

  if (tagHiddenInputs[0].value !== ""){
    let deleteIndexes = findDeletedIndexes(tagHiddenInputsValues, tagPillsValues)
    deleteIndexes.forEach((deleteIndex) => {
      deleteButtons[deleteIndex].click();
    })
    updateTagList();
  }

  function findDeletedIndexes(arr1, arr2) {
    const largerArray = arr1.length >= arr2.length ? arr1 : arr2;
    const smallerArray = arr1.length >= arr2.length ? arr2 : arr1;
    const deletedIndexes = [];
    let appearedList = []
    for (let i = 0; i < largerArray.length; i++) {
      const currentElement = largerArray[i];
      if (!smallerArray.includes(currentElement) || appearedList.includes(currentElement)) {
        deletedIndexes.push(i);
      } else if (!appearedList.includes(currentElement)) {
        appearedList.push(currentElement)
      }
    }
    return deletedIndexes;
  }

  function getHiddenInputs() {
    const fieldsElements = document.querySelectorAll('.fields');
    const hiddenInputs = [];
    fieldsElements.forEach((fieldsElement) => {
        const hiddenInputInField = fieldsElement.querySelector('input[type=hidden]');
        if (hiddenInputInField.value === "1") {
          hiddenInputs.push(true);
        } else {
          hiddenInputs.push(false)
        }
    });
    return hiddenInputs;
  }

  function updateTagList() {
    tagHiddenInputs = document.querySelectorAll('.hidden-tags')
    deleteButtons = document.getElementsByClassName('remove_nested_fields')
    tagPills = document.getElementsByClassName('tag-pill')
    fields = document.querySelectorAll('.fields')
    destroys = getHiddenInputs();
    
    for (var i = 0; i < tagPills.length; i++) {
      (function(index) {
        tagPills[index].addEventListener('click', function() {
          tagPills[index].style.display = 'none';
          deleteButtons[index].click();
          updateTagList();
        });
      })(i);
    }
  }
  
  function setTagName(name) {
    tagList.innerHTML += `<span class="tag-default tag-pill"> <i class="ion-close-round"></i> ${name} </span>`
  }

  tagInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (tagHiddenInputs[0].value !== ""){
        addButton.click();
      }
      tagHiddenInputs = document.querySelectorAll('.hidden-tags')
      let inputValue = tagInput.value;
      tagInput.value = '';
      tagHiddenInputs[tagHiddenInputs.length - 1].value = inputValue;
      setTagName(inputValue);
      updateTagList();
    }
  })

  // 422エラーでrenderメソッドで呼ばれた時
document.addEventListener("turbo:render", function() {
  const tagInput = document.getElementById('tag-input')
  const addButton = document.getElementById('add-button')
  const tagList = document.getElementById('tag-list-render')
  let tagHiddenInputs = document.querySelectorAll('.hidden-tags')
  const tagHiddenInputsValues = Array.from(tagHiddenInputs).map(input => input.value.trim());
  let deleteButtons = document.getElementsByClassName('remove_nested_fields')
  let tagPills = document.getElementsByClassName('visible-pill')
  const tagPillsValues = Array.from(tagPills).map(tagPill => tagPill.textContent.trim());

  if (tagHiddenInputs[0].value !== ""){
    let deleteIndexes = findDeletedIndexes(tagHiddenInputsValues, tagPillsValues)
    deleteIndexes.forEach((deleteIndex) => {
      deleteButtons[deleteIndex].click();
    })
    updateTagList();
  }

  function findDeletedIndexes(arr1, arr2) {
    const largerArray = arr1.length >= arr2.length ? arr1 : arr2;
    const smallerArray = arr1.length >= arr2.length ? arr2 : arr1;
    const deletedIndexes = [];
    let appearedList = []
    for (let i = 0; i < largerArray.length; i++) {
      const currentElement = largerArray[i];
      if (!smallerArray.includes(currentElement) || appearedList.includes(currentElement)) {
        deletedIndexes.push(i);
      } else if (!appearedList.includes(currentElement)) {
        appearedList.push(currentElement)
      }
    }
    return deletedIndexes;
  }

  function updateTagList() {
    tagHiddenInputs = document.querySelectorAll('.hidden-tags')
    deleteButtons = document.getElementsByClassName('remove_nested_fields')
    tagPills = document.getElementsByClassName('tag-pill')
    
    for (var i = 0; i < tagPills.length; i++) {
      (function(index) {
        tagPills[index].addEventListener('click', function() {
          tagPills[index].style.display = 'none';
          deleteButtons[index].click();
          updateTagList();
        });
      })(i);
    }
  }
  
  function setTagName(name) {
    tagList.innerHTML += `<span class="tag-default tag-pill"> <i class="ion-close-round"></i> ${name} </span>`
  }

  tagInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (tagHiddenInputs[0].value !== ""){
        addButton.click();
      }
      tagHiddenInputs = document.querySelectorAll('.hidden-tags')
      let inputValue = tagInput.value;
      tagInput.value = '';
      tagHiddenInputs[tagHiddenInputs.length - 1].value = inputValue;
      setTagName(inputValue);
      updateTagList();
    }
  })
  updateTagList();
})
