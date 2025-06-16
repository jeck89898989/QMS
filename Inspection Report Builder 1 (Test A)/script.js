// Global utility functions - moved outside of DOM ready event for accessibility
function calculateTotals() {
  // Calculate inspection time partial total
  const inspectionInputs = [
    document.querySelector('input[name="inspection-m"]'),
    document.querySelector('input[name="inspection-t"]'),
    document.querySelector('input[name="inspection-w"]'),
    document.querySelector('input[name="inspection-th"]'),
    document.querySelector('input[name="inspection-f"]')
  ];
  
  let inspectionTotal = 0;
  inspectionInputs.forEach(input => {
    if (input) {
      const value = parseFloat(input.value) || 0;
      inspectionTotal += value;
    }
  });
  
  const inspectionPartial = document.querySelector('input[name="inspection-partial"]');
  if (inspectionPartial) inspectionPartial.value = inspectionTotal;
  
  // Calculate reporting time partial total
  const reportingInputs = [
    document.querySelector('input[name="reporting-m"]'),
    document.querySelector('input[name="reporting-t"]'),
    document.querySelector('input[name="reporting-w"]'),
    document.querySelector('input[name="reporting-th"]'),
    document.querySelector('input[name="reporting-f"]')
  ];
  
  let reportingTotal = 0;
  reportingInputs.forEach(input => {
    if (input) {
      const value = parseFloat(input.value) || 0;
      reportingTotal += value;
    }
  });
  
  const reportingPartial = document.querySelector('input[name="reporting-partial"]');
  if (reportingPartial) reportingPartial.value = reportingTotal;
  
  // Calculate travel time partial total
  const travelInputs = [
    document.querySelector('input[name="travel-m"]'),
    document.querySelector('input[name="travel-t"]'),
    document.querySelector('input[name="travel-w"]'),
    document.querySelector('input[name="travel-th"]'),
    document.querySelector('input[name="travel-f"]')
  ];
  
  let travelTotal = 0;
  travelInputs.forEach(input => {
    if (input) {
      const value = parseFloat(input.value) || 0;
      travelTotal += value;
    }
  });
  
  const travelPartial = document.querySelector('input[name="travel-partial"]');
  if (travelPartial) travelPartial.value = travelTotal;
  
  // Calculate km total
  const kmInputs = [
    document.querySelector('input[name="km-m"]'),
    document.querySelector('input[name="km-t"]'),
    document.querySelector('input[name="km-w"]'),
    document.querySelector('input[name="km-th"]'),
    document.querySelector('input[name="km-f"]')
  ];
  
  let kmTotal = 0;
  kmInputs.forEach(input => {
    if (input) {
      const value = parseFloat(input.value) || 0;
      kmTotal += value;
    }
  });
  
  const kmTotalElement = document.querySelector('input[name="km-total"]');
  if (kmTotalElement) kmTotalElement.value = kmTotal + ' Km';
  
  // Calculate weekly total (sum of all partial totals)
  const weeklyTotal = inspectionTotal + reportingTotal + travelTotal;
  const weeklyTotalElement = document.querySelector('input[name="weekly-total"]');
  if (weeklyTotalElement) weeklyTotalElement.value = weeklyTotal + ' Hours';
}

// Make generateControlNumber function globally available
function generateControlNumber() {
  // Get input elements
  const reportNumber = document.getElementById('report-number');
  const supplier = document.getElementById('supplier');
  const irRevision = document.getElementById('ir-revision');
  const irDate = document.getElementById('ir-date');
  const controlNumber = document.getElementById('control-number');
  
  if (!reportNumber || !supplier || !irRevision || !irDate || !controlNumber) return;
  
  const reportValue = reportNumber.value || '----';
  const supplierValue = supplier.value || '----';
  const revisionValue = irRevision.value || '0';
  const dateValue = irDate.value;
  
  // Format date components
  let formattedDate = '---.--.----';
  
  if (dateValue) {
    const dateObj = new Date(dateValue);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    formattedDate = `${day}.${month}.${year}`;
  }
  
  // Get current year
  const currentYear = new Date().getFullYear();
  
  // Generate control number in specified format
  const controlValue = `${reportValue} - ${supplierValue} - ${revisionValue} - ${currentYear} - ${formattedDate}`;
  
  // Update control number field
  controlNumber.value = controlValue;
}

// Global utility function for getting current date string
function getCurrentDateString() {
  const date = new Date();
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}

// Get saved reports from localStorage (moved to global scope)
function getSavedReports() {
  const savedReportsStr = localStorage.getItem('savedReports');
  return savedReportsStr ? JSON.parse(savedReportsStr) : [];
}

// Function to find the closest drop target based on Y position
function findDropTarget(y, sections) {
  return sections.reduce((closest, section) => {
    const rect = section.getBoundingClientRect();
    const offset = y - rect.top - rect.height / 2;
    
    if (closest === null || Math.abs(offset) < Math.abs(closest.offset)) {
      return { element: section, offset: offset };
    } else {
      return closest;
    }
  }, null)?.element || null;
}

// Function to save the current layout state
function saveLayoutState() {
  const sections = document.querySelectorAll('.draggable');
  const orderArray = Array.from(sections).map(section => section.getAttribute('data-section-id'));
  localStorage.setItem('formSectionOrder', JSON.stringify(orderArray));
}

// Function to load and apply saved layout state
function loadLayoutState() {
  const savedOrder = localStorage.getItem('formSectionOrder');
  
  if (savedOrder) {
    try {
      const orderArray = JSON.parse(savedOrder);
      const container = document.querySelector('form');
      
      // Reorder sections according to saved state
      orderArray.forEach(sectionId => {
        const section = document.querySelector(`.draggable[data-section-id="${sectionId}"]`);
        if (section) {
          container.appendChild(section);
        }
      });
    } catch (error) {
      console.error('Error restoring layout:', error);
    }
  }
}

// Load report data function (moved to global scope)
function loadReportFromData(report) {
  const form = document.getElementById('inspection-report');

  // Reset form first
  form.reset();

  // Clear dynamically added table rows before loading new data
  form.querySelectorAll('.add-row-btn').forEach(button => {
      const table = button.previousElementSibling;
      if (table && table.tagName === 'TABLE' && !table.classList.contains('item-details-transposed')) {
          const tbody = table.querySelector('tbody');
          // Find the template row based on name pattern if exists, otherwise assume last row is template
          let templateRow = null;
          const firstInputInLastRow = tbody.lastElementChild?.querySelector('input, textarea, select');
          if (firstInputInLastRow && firstInputInLastRow.name.match(/-template$/)) {
              templateRow = tbody.lastElementChild;
          } else {
               // Check if any row is explicitly marked as a template or has a template input name pattern
               templateRow = Array.from(tbody.children).find(row => row.querySelector('input[name$="-template"]'));
               if (!templateRow && tbody.children.length > 0) {
                   // Fallback: if no explicit template, assume the *original* rows that were there on load are templates
                   // This requires a more robust way to identify original rows vs added rows,
                   // but for this specific form structure, it's simpler to just clear all non-template-pattern rows
                   // and rely on the load logic to add rows if needed based on data indexes.
               }
          }


          // Remove all rows except the identified template rows
          Array.from(tbody.children).forEach(row => {
              let isTemplate = false;
              // Check if this row is one of the identified templates
              if (templateRow && row === templateRow) isTemplate = true;
               if (!isTemplate && row.querySelector('input[name$="-template"]')) isTemplate = true; // Also check for template names

              if (!isTemplate) {
                  row.remove();
              }
          });
      }
  });

   // Clear document references rows (both tables)
   document.querySelectorAll('.document-references').forEach(table => {
        const tbody = table.querySelector('tbody');
        // Find template rows based on name pattern
        const templateRows = Array.from(tbody.querySelectorAll('tr')).filter(row => row.querySelector('input[name$="-template"]'));

         Array.from(tbody.children).forEach(row => {
              if (!templateRows.includes(row)) {
                  row.remove();
              }
          });
   });


  // Fill form with saved data
  for (let key in report.data) {
    if (key === '_sectionOrder') continue;

    // Special handling for transposed item details
    if (key.startsWith('item-')) {
        // key format is item-{original-header}-{item-index} e.g., item-po-1
        const keyParts = key.split('-');
        const originalHeaderName = keyParts.slice(1, -1).join('-');
        const itemIndex = parseInt(keyParts[keyParts.length - 1]);

        // Find the correct input element in the transposed table
        // The structure is table > tbody > tr (for header) > td > input/textarea
        // We need the row that corresponds to the original header name, and the td that corresponds to the item index
        const table = form.querySelector('.item-details-transposed table');
        if (table) {
             const rows = table.querySelectorAll('tbody tr');
             let targetRow = null;
             rows.forEach(row => {
                 const headerCell = row.querySelector('th');
                 // Clean up header text for comparison (remove placeholder hints etc.)
                 const headerText = headerCell ? headerCell.textContent.trim().toLowerCase().replace(/[^a-z0-9]/g, '') : '';

                 // Simplify original header name for comparison (e.g. 'po n°' -> 'po')
                 const simplifiedOriginalHeader = originalHeaderName.replace(/[^a-z0-9]/g, '');

                 if (headerText.includes(simplifiedOriginalHeader) && simplifiedOriginalHeader !== '') { // Simple check, might need refinement
                     targetRow = row;
                 }
             });

             if (targetRow) {
                  // Find the cell corresponding to the item index (1-based)
                 const targetCell = targetRow.querySelectorAll('td')[itemIndex - 1];
                 if (targetCell) {
                      const input = targetCell.querySelector('input, textarea'); // Look for input or textarea
                      if (input) {
                           input.value = report.data[key];
                      } else {
                           console.warn(`Input/Textarea element not found in cell for key "${key}". Skipping.`);
                      }
                 } else {
                      console.warn(`Cell not found for item index ${itemIndex} for key "${key}". Skipping.`);
                 }
             } else {
                 console.warn(`Row for original header "${originalHeaderName}" not found in transposed table for key "${key}". Skipping.`);
             }
        }


    } else {
        // Handle other inputs (including standard textareas)
        const input = form.elements[key];

        if (input) {
          // Handle single inputs
          if (input.type === 'checkbox' || input.type === 'radio') {
            input.checked = report.data[key] === 'on' || report.data[key] === true || report.data[key] === input.value; // Added check for value match
          } else if (input.tagName === 'SELECT' || input.tagName === 'TEXTAREA' || (input.tagName === 'INPUT' && input.type === 'text') || (input.tagName === 'INPUT' && input.type === 'date') || (input.tagName === 'INPUT' && input.type === 'tel')) {
             // Handle dynamic table inputs by adding rows if needed (excluding transposed table)
             if (input.name && input.name.match(/-[0-9]+$/) && !input.closest('.item-details-transposed')) {
                  const nameParts = input.name.split('-');
                  const baseName = nameParts.slice(0, -1).join('-');
                  const index = parseInt(nameParts[nameParts.length - 1]);

                  // Find the table this input belongs to
                  const table = input.closest('table');
                  if (table) {
                      const tbody = table.querySelector('tbody');
                       // Ensure enough rows exist up to the required index
                       // Need to find the highest existing index to know how many rows we need to add
                       let currentHighestIndex = 0;
                       tbody.querySelectorAll('tr').forEach(row => {
                           const rowInput = row.querySelector(`[name="${key}"]`);
                            if(rowInput) {
                                const rowNameParts = rowInput.name.split('-');
                                if (rowNameParts.length > 1 && !isNaN(rowNameParts[rowNameParts.length - 1])) {
                                   currentHighestIndex = Math.max(currentHighestIndex, parseInt(rowNameParts[rowNameParts.length - 1]));
                                }
                            }
                       });

                       // Add rows until we have the row for the required index
                       while (currentHighestIndex < index) {
                            // Find a template row. Prioritize rows with "-template" in the name.
                            let templateRow = null;
                            const firstInputInLastRow = tbody.lastElementChild?.querySelector('input, textarea, select');
                            if (firstInputInLastRow && firstInputInLastRow.name.match(/-template$/)) {
                                templateRow = tbody.lastElementChild;
                            } else {
                                 // Check if any row is explicitly marked as a template or has a template input name pattern
                                 templateRow = Array.from(tbody.children).find(row => row.querySelector('input[name$="-template"]'));
                                 if (!templateRow && tbody.children.length > 0) {
                                     // Fallback: if no explicit template, assume the last row is the template
                                     templateRow = tbody.lastElementChild;
                                 }
                            }

                            if (templateRow) {
                                 const newRow = templateRow.cloneNode(true);
                                 const newRowInputs = newRow.querySelectorAll('input, textarea, select');
                                 currentHighestIndex++; // Increment for the row we are about to add

                                 newRowInputs.forEach(newInput => {
                                      // Update the input name with the new index
                                       const newNameParts = newInput.name.split('-');
                                       if (newNameParts.length > 1 && newNameParts[newNameParts.length - 1] === 'template') {
                                            newNameParts[newNameParts.length - 1] = currentHighestIndex.toString();
                                            newInput.name = newNameParts.join('-');
                                            newInput.id = newNameParts.join('-'); // Update ID as well
                                            newInput.value = ''; // Clear value
                                            if (newInput.type === 'checkbox' || newInput.type === 'radio') newInput.checked = false;
                                       } else if (newNameParts.length > 1 && !isNaN(newNameParts[newNameParts.length - 1])) {
                                            // This case handles tables like Calibration where the original rows had numbers
                                            newNameParts[newNameParts.length - 1] = currentHighestIndex.toString();
                                            newInput.name = newNameParts.join('-');
                                            newInput.id = newNameParts.join('-');
                                            newInput.value = ''; // Clear value
                                            if (newInput.type === 'checkbox' || newInput.type === 'radio') newInput.checked = false;
                                       }
                                 });

                                // Add the new row before any template rows if they exist, otherwise at the end
                                const templateRowElement = tbody.querySelector('tr input[name$="-template"]')?.closest('tr');
                                if (templateRowElement) {
                                    tbody.insertBefore(newRow, templateRowElement);
                                } else {
                                     tbody.appendChild(newRow);
                                }

                            } else {
                                console.error(`Could not find a template row to add for dynamic table ${tableSelector}`);
                                break; // Stop adding rows if no template is found
                            }
                       }

                       // Now that the row for 'index' exists, find the correct input and set its value
                       // We need to find the input specifically in the row corresponding to the 'index'
                       const targetRow = Array.from(tbody.children).find(row => {
                           const rowInput = row.querySelector(`[name="${key}"]`);
                           return rowInput !== null;
                       });

                       if (targetRow) {
                            const targetInput = targetRow.querySelector(`[name="${key}"]`);
                            if(targetInput) {
                                targetInput.value = report.data[key];
                            }
                       } else {
                           console.warn(`Target row not found for key "${key}" after attempting to add rows.`);
                       }


                  } else {
                    console.warn(`Table not found for input name "${key}" during loading. Skipping.`);
                  }
             } else {
                // Handle static inputs and standard textareas
                input.value = report.data[key];
             }
          }
        } else {
            // Handle checkbox/radio groups that are not single inputs
             if (Array.isArray(form.elements[key])) {
                 Array.from(form.elements[key]).forEach(groupInput => {
                     if (groupInput.type === 'checkbox' || groupInput.type === 'radio') {
                        if (Array.isArray(report.data[key])) {
                             groupInput.checked = report.data[key].includes(groupInput.value);
                        } else {
                             // Handle case where saved data is a single value string (from older saves)
                             groupInput.checked = report.data[key] === groupInput.value;
                        }
                     }
                 });
             } else {
                 console.warn(`Form element with name "${key}" not found during loading. Skipping.`);
             }
        }
    }
  }

  // Re-add delete buttons to loaded dynamic rows (excluding transposed table and templates)
  form.querySelectorAll('.add-row-btn').forEach(button => {
       const table = button.previousElementSibling;
       if (table && table.tagName === 'TABLE' && !table.classList.contains('item-details-transposed')) {
            const rows = table.querySelectorAll('tbody tr');
             rows.forEach(row => {
                let isTemplate = false;
                if (row.querySelector('input[name$="-template"]')) isTemplate = true; // Check for template names

                if (!isTemplate) {
                     // Ensure the cell for the delete button exists
                     let actionCell = row.querySelector('.action-cell');
                     if (!actionCell) {
                          actionCell = document.createElement('td');
                          actionCell.className = 'action-cell';
                          row.appendChild(actionCell);
                     }
                     addDeleteButton(row); // Add the delete button
                }
             });
       }
  });


   // Restore image data if available
   if (report.imageData) {
       localStorage.setItem('reportImages', JSON.stringify(report.imageData));
       restoreImageData();
   } else {
       // If no image data in the report, clear local storage and display placeholder
       localStorage.removeItem('reportImages');
       restoreImageData(); // Call to ensure placeholder is shown
   }


  // Recalculate totals and control number
  calculateTotals();
  generateControlNumber();

}

// Function to restore image data
function restoreImageData() {
  const imagesContainer = document.querySelector('.images-container');
  if (!imagesContainer) return;
  
  const savedImages = localStorage.getItem('reportImages');
  
  // Clear current images before restoring
  imagesContainer.innerHTML = '';

  if (savedImages) {
    try {
      const imageData = JSON.parse(savedImages);
      
      // Restore each image
      imageData.forEach(imgData => {
        const imageItem = document.createElement('div');
        imageItem.className = 'image-item';
        imageItem.dataset.imageId = imgData.id;
        
        // Create image header with title and controls
        const imageHeader = document.createElement('div');
        imageHeader.className = 'image-header';
        
        const imageTitle = document.createElement('h4');
        imageTitle.className = 'image-title';
        imageTitle.textContent = imgData.filename;
        
        const imageControls = document.createElement('div');
        imageControls.className = 'image-controls';
        
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'remove-image-btn';
        removeBtn.innerHTML = '<i class="fas fa-trash"></i> Remove';
        removeBtn.addEventListener('click', () => {
          imageItem.remove();
          updateNoImagesPlaceholder();
          saveImageData(); 
        });
        
        imageControls.appendChild(removeBtn);
        imageHeader.appendChild(imageTitle);
        imageHeader.appendChild(imageControls);
        
        // Create image preview
        const imagePreview = document.createElement('div');
        imagePreview.className = 'image-preview';
        
        const img = document.createElement('img');
        img.src = imgData.image;
        img.alt = imgData.filename;
        
        imagePreview.appendChild(img);
        
        // Create comment area
        const commentContainer = document.createElement('div');
        commentContainer.className = 'image-comment-container';
        
        const commentLabel = document.createElement('label');
        commentLabel.textContent = 'Comments:';
        commentLabel.setAttribute('for', `comment-${imgData.id}`);
        
        const commentTextarea = document.createElement('textarea');
        commentTextarea.className = 'image-comment';
        commentTextarea.id = `comment-${imgData.id}`;
        commentTextarea.name = `comment-${imgData.id}`;
        commentTextarea.value = imgData.comment || '';
        
        // Save comment when it changes
        commentTextarea.addEventListener('input', saveImageData);
        
        commentContainer.appendChild(commentLabel);
        commentContainer.appendChild(commentTextarea);
        
        // Assemble the image item
        imageItem.appendChild(imageHeader);
        imageItem.appendChild(imagePreview);
        imageItem.appendChild(commentContainer);
        
        // Add the image item to the container
        imagesContainer.appendChild(imageItem);
      });
      
    } catch (error) {
      console.error('Error restoring image data:', error);
      // If restoration fails, clear saved data to prevent future errors
      localStorage.removeItem('reportImages');
    }
  }
   updateNoImagesPlaceholder(); 
}

// Function to update no images placeholder
function updateNoImagesPlaceholder() {
  const imagesContainer = document.querySelector('.images-container');
  if (!imagesContainer) return;
  
  // Remove existing placeholder if present
   const existingPlaceholder = imagesContainer.querySelector('.no-image-text');
   if (existingPlaceholder) {
       existingPlaceholder.remove();
   }

  // Check for image-item elements (excluding the placeholder itself)
  const imageItems = imagesContainer.querySelectorAll('.image-item');

  if (imageItems.length === 0) {
    const placeholder = document.createElement('div');
    placeholder.className = 'no-image-text';
    placeholder.textContent = 'No images have been added yet. Click "Add New Image" to upload images.';
    imagesContainer.appendChild(placeholder);
  } else {
    // Remove any existing placeholder
    const placeholder = imagesContainer.querySelector('.no-image-text');
    if (placeholder) placeholder.remove();
  }
}

// Function to save image data
function saveImageData() {
  const imageData = [];
  const items = document.querySelectorAll('.image-item');
  
  // Collect all images and their comments
  items.forEach(item => {
    const imageId = item.dataset.imageId;
    const imgElement = item.querySelector('img');
    const commentElement = item.querySelector('.image-comment');
    
    if (imgElement && commentElement) {
      imageData.push({
        id: imageId,
        image: imgElement.src,
        filename: imgElement.alt,
        comment: commentElement.value
      });
    }
  });
  
  // Store in localStorage
  localStorage.setItem('reportImages', JSON.stringify(imageData));
}

// Function to toggle dropdown menu
function toggleDropdown() {
  document.querySelector('.dropdown-content').classList.toggle('show');
}

// Close the dropdown if user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn') && !event.target.closest('.dropbtn')) {
    const dropdowns = document.getElementsByClassName('dropdown-content');
    for (let i = 0; i < dropdowns.length; i++) {
      const openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
};

document.addEventListener('DOMContentLoaded', function() {
  (function(){
    const input = document.getElementById('itemCountInput');
    const table = document.querySelector('.item-details-transposed table');
    if (!input || !table) return;
    const headers = table.querySelectorAll('thead th');
    const maxItems = headers.length - 1;
    input.max = maxItems;
    input.min = 1;
    function setColumns(n) {
      headers.forEach((th,i)=> th.style.display = (i===0||i<=n)?'':'none');
      table.querySelectorAll('tbody tr').forEach(row=>{
        row.querySelectorAll('td').forEach((td,i)=> td.style.display = (i<n)?'':'none');
      });
    }
    setColumns(parseInt(input.value)||1);
    input.addEventListener('input', ()=> {
      let v = parseInt(input.value)||1;
      if(v<1)v=1; if(v>maxItems)v=maxItems;
      input.value=v; setColumns(v);
    });
  })();

  // Initialize dropdown functionality
  const dropBtn = document.querySelector('.dropbtn');
  if (dropBtn) {
    dropBtn.addEventListener('click', toggleDropdown);
  }
  
  // Add event listeners to calculate totals when inputs change
  const timeInputs = document.querySelectorAll('.time-breakdown input');
  timeInputs.forEach(input => {
    input.addEventListener('input', calculateTotals);
  });
  
  // Add accordion functionality for the condensed sections
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  
  accordionHeaders.forEach(header => {
    header.addEventListener('click', function() {
      // Toggle active class on the header
      this.classList.toggle('active');
      
      // Toggle the visibility of the content
      const content = this.nextElementSibling;
      if (content.style.maxHeight) {
        content.style.maxHeight = null;
        content.classList.remove('active');
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
        content.classList.add('active');
      }
    });
  });
  
  // Initialize by opening the first panel
  if (accordionHeaders.length > 0) {
    accordionHeaders[0].click();
  }
  
  // File attachment handling
  const fileInput = document.getElementById('file-attachments');
  const fileList = document.getElementById('file-list');
  const uploadedFiles = [];
  
  if (fileInput && fileList) {
    fileInput.addEventListener('change', function(e) {
      const files = Array.from(e.target.files);
      
      // Clear file list display
      fileList.innerHTML = '';
      
      // Store files for later use
      files.forEach(file => {
        uploadedFiles.push(file);
        
        // Create file display element
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
          <span>${file.name}</span>
          <button type="button" class="remove-file" data-name="${file.name}">×</button>
        `;
        fileList.appendChild(fileItem);
      });
      
      // Add event listeners to remove buttons
      document.querySelectorAll('.remove-file').forEach(button => {
        button.addEventListener('click', function() {
          const fileName = this.getAttribute('data-name');
          const index = uploadedFiles.findIndex(file => file.name === fileName);
          if (index !== -1) {
            uploadedFiles.splice(index, 1);
            this.parentElement.remove();
          }
        });
      });
    });
  }
  
  // Zip all attachments button
  const zipBtn = document.getElementById('zipAttachmentsBtn');
  if (zipBtn) {
    zipBtn.addEventListener('click', function() {
      if (uploadedFiles.length === 0) {
        alert('No attachments to zip.');
        return;
      }
      createZipAndDownload(uploadedFiles);
    });
  }

  // Export to CSV functionality
  document.querySelector('.export-btn').addEventListener('click', function() {
    // Collect all form data
    const form = document.getElementById('inspection-report');
    const formData = new FormData(form);
    const data = {};
    
    // Convert FormData to object
    for (let [key, value] of formData.entries()) {
      // Skip file inputs
      if (key !== 'file-attachments') {
        data[key] = value;
      }
    }
    
    // Convert to CSV
    let csvContent = 'data:text/csv;charset=utf-8,';
    
    // Add headers and values
    for (let key in data) {
      csvContent += `${key},${data[key]}\r\n`;
    }
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `inspection_report_${getCurrentDateString()}.csv`);
    document.body.appendChild(link);
    
    // Download CSV
    link.click();
    
    // Handle file attachments if any
    if (uploadedFiles && uploadedFiles.length > 0) {
      createZipAndDownload(uploadedFiles);
    }
  });
  
  // Function to create zip file with attachments
  function createZipAndDownload(files) {
    // Create JSZip instance - load dynamically
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
    document.head.appendChild(script);
    
    script.onload = function() {
      const zip = new JSZip();
      
      // Add files to the zip
      let count = 0;
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
          // Add file content to zip
          const fileData = e.target.result;
          zip.file(file.name, fileData);
          count++;
          
          // When all files are processed, generate the zip
          if (count === files.length) {
            zip.generateAsync({type: 'blob'}).then(function(content) {
              // Create download link for the zip
              const zipLink = document.createElement('a');
              zipLink.href = URL.createObjectURL(content);
              zipLink.download = `attachments_${getCurrentDateString()}.zip`;
              document.body.appendChild(zipLink);
              zipLink.click();
              
              // Clean up
              setTimeout(() => {
                document.body.removeChild(zipLink);
                URL.revokeObjectURL(zipLink.href);
              }, 100);
            });
          }
        };
        reader.readAsArrayBuffer(file);
      });
    };
  }
  
  // Handle form submission for printing
  document.querySelector('.print-btn').addEventListener('click', function(e) {
    e.preventDefault();
    window.print();
  });
  
  // Add event listeners to update control number when relevant fields change
  document.getElementById('report-number').addEventListener('input', generateControlNumber);
  document.getElementById('supplier').addEventListener('input', generateControlNumber);
  document.getElementById('ir-revision').addEventListener('input', generateControlNumber);
  document.getElementById('ir-date').addEventListener('input', generateControlNumber);
  
  // Initialize control number on page load
  generateControlNumber();
  
  // Set today's date as default for IR Issued Date
  const today = new Date();
  const formattedDate = today.toISOString().substr(0, 10);
  document.getElementById('ir-date').value = formattedDate;
  
  // Initialize calculations
  calculateTotals();
  
  // Drag and Drop functionality for form sections
  initDragAndDrop();
  
  // Initialize simple save and load functionality
  initSimpleSaveAndLoad();
  
  // Initialize file-based save and load functionality
  initFileSaveAndLoad();
  
  // Initialize image documentation section
  initImageDocumentation();
  
  // Initialize Save Form to HTML functionality
  initSaveFormToHTML();
  
  // Initialize table row management
  initTableRowManagement();
  
  // Expand all accordion sections by default
  setTimeout(() => {
    document.querySelectorAll('.accordion-header').forEach(header => {
      header.classList.add('active');
      const content = header.nextElementSibling;
      if (content && content.classList.contains('accordion-content')) {
        content.classList.add('active');
        content.style.maxHeight = 'none'; 
      }
    });
  }, 100);
  
  // Delete selected rows in Document References tables
  const deleteSelectedDocsBtn = document.getElementById('deleteSelectedDocsBtn');
  if (deleteSelectedDocsBtn) {
    deleteSelectedDocsBtn.addEventListener('click', function() {
      let removed = 0;
      document.querySelectorAll('.document-references tbody tr').forEach(row => {
        const chk = row.querySelector('input[type="checkbox"]');
        if (chk && chk.checked) {
          row.remove();
          removed++;
        }
      });
      if (!removed) {
        alert('No documents selected to delete.');
      }
    });
  }

  document.addEventListener('click', function(e) {
    const td = e.target.closest('td');
    if (!td) return;
    // if cell has no input or textarea inside and is not already in edit mode
    if (!td.querySelector('input, textarea') && !td.isContentEditable) {
      td.contentEditable = true;
      td.focus();
      // when the cell loses focus, turn off editing
      const onBlur = function() {
        td.contentEditable = false;
        td.removeEventListener('blur', onBlur);
      };
      td.addEventListener('blur', onBlur);
    }
  });

  // custom-inspection: inline-edit title, add category & subsection
  (function(){
    const customSection = document.querySelector('[data-section-id="custom-inspection"]');
    if (!customSection) return;
    const hdr = customSection.querySelector('h3');
    if (hdr) {
      hdr.addEventListener('click', () => {
        hdr.contentEditable = 'true'; hdr.focus();
        hdr.addEventListener('blur', () => hdr.contentEditable = 'false', {once:true});
      });
    }
    const tbl = customSection.querySelector('table');
    const btnCat = customSection.querySelector('#addCustomCategoryBtn');
    const btnRow = customSection.querySelector('#addCustomRowBtn');
    if (btnCat && tbl) {
      btnCat.addEventListener('click', () => {
        const name = prompt('Enter category name:');
        if (!name) return;
        const tr = document.createElement('tr');
        tr.className = 'category-row';
        const td = document.createElement('td');
        td.colSpan = 6; td.contentEditable = 'true';
        td.textContent = name;
        tr.appendChild(td);
        tbl.tBodies[0].appendChild(tr);
      });
    }
    if (btnRow && tbl) {
      btnRow.addEventListener('click', () => {
        const desc = prompt('Enter subsection title:');
        if (!desc) return;
        const guidance = prompt('Enter guidance text (optional):') || '';
        const id = Date.now();
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td></td>
          <td contenteditable="true">${desc}</td>
          <td><input type="radio" name="custom-inspection-${id}" value="pass"></td>
          <td><input type="radio" name="custom-inspection-${id}" value="fail"></td>
          <td><input type="radio" name="custom-inspection-${id}" value="na"></td>
          <td contenteditable="true">${guidance}</td>
        `;
        tbl.tBodies[0].appendChild(tr);
      });
    }
  })();

  // Export Custom Inspection to CSV
  const exportCustomBtn = document.querySelector('.export-custom-csv-btn');
  if (exportCustomBtn) {
    exportCustomBtn.addEventListener('click', function() {
      const section = document.querySelector('[data-section-id="custom-inspection"]');
      if (!section) return;
      const table = section.querySelector('table');
      if (!table) return;
      const rows = table.querySelectorAll('tbody tr');
      let csv = 'Category,Description,Result,Guidance\n';
      rows.forEach(tr => {
        if (tr.classList.contains('category-row')) {
          const cat = tr.querySelector('td')?.textContent.trim().replace(/"/g,'""') || '';
          csv += `"${cat}",,,\n`;
        } else {
          const cells = tr.querySelectorAll('td');
          const desc = cells[1]?.textContent.trim().replace(/"/g,'""') || '';
          let res = '';
          if (cells[2]?.querySelector('input')?.checked) res = 'Pass';
          else if (cells[3]?.querySelector('input')?.checked) res = 'Fail';
          else if (cells[4]?.querySelector('input')?.checked) res = 'N/A';
          const guidance = cells[5]?.textContent.trim().replace(/"/g,'""') || '';
          csv += `"","${desc}","${res}","${guidance}"\n`;
        }
      });
      const blob = new Blob([csv], {type: 'text/csv'});
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `custom_inspection_${getCurrentDateString()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // Custom Inspection CSV import
  const importCustomCsvBtn = document.getElementById('importCustomCsvBtn');
  const importCustomCsvInput = document.getElementById('importCustomCsvInput');
  if (importCustomCsvBtn && importCustomCsvInput) {
    importCustomCsvBtn.addEventListener('click', () => importCustomCsvInput.click());
    importCustomCsvInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(evt) {
        parseCustomCsv(evt.target.result);
      };
      reader.readAsText(file);
      importCustomCsvInput.value = '';
    });
  }

  // ADD REMOVE SECTION BUTTONS
  document.querySelectorAll('.form-section .section-header').forEach(header => {
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'remove-section-btn';
    removeBtn.innerHTML = '<i class="fas fa-times"></i>';
    removeBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      if (confirm('Remove this section?')) {
        header.closest('.form-section').remove();
      }
    });
    header.appendChild(removeBtn);
  });

  // -- Form Template handling --
  (function(){
    const templateSelect = document.getElementById('formTemplateSelect');
    if (!templateSelect) return;
    const modal = document.getElementById('templateModal');
    const closeBtn = modal.querySelector('.close');
    const cancelBtn = document.getElementById('cancelTemplateBtn');
    const saveBtn = document.getElementById('saveTemplateBtn');
    const nameInput = document.getElementById('newTemplateName');
    const sectionList = document.getElementById('templateSectionList');
    let templates = JSON.parse(localStorage.getItem('formTemplates') || '{}');

    // ensure default template includes all sections
    if (!templates.default) {
      templates.default = Array.from(document.querySelectorAll('.form-section'))
                                .map(sec => sec.getAttribute('data-section-id'));
      localStorage.setItem('formTemplates', JSON.stringify(templates));
    }
    // populate dropdown with saved templates
    Object.keys(templates).forEach(key => {
      if (key !== 'default') {
        const opt = document.createElement('option');
        opt.value = key; opt.textContent = key;
        templateSelect.appendChild(opt);
      }
    });

    // when selection changes
    templateSelect.addEventListener('change', () => {
      const val = templateSelect.value;
      if (val === 'new') {
        // open modal with section list
        sectionList.innerHTML = '';
        document.querySelectorAll('.form-section').forEach(sec => {
          const id = sec.getAttribute('data-section-id');
          const title = sec.querySelector('h3')?.textContent.trim() || id;
          const div = document.createElement('div');
          div.className = 'form-group';
          const cb = document.createElement('input');
          cb.type = 'checkbox'; cb.id = 'tmpl-'+id; cb.value = id; cb.checked = true;
          const lbl = document.createElement('label');
          lbl.htmlFor = cb.id; lbl.textContent = title;
          div.appendChild(cb); div.appendChild(lbl);
          sectionList.appendChild(div);
        });
        nameInput.value = '';
        modal.style.display = 'block';
      } else {
        // apply a template
        const sel = templates[val] || [];
        document.querySelectorAll('.form-section').forEach(sec => {
          const id = sec.getAttribute('data-section-id');
          sec.style.display = (val === 'default' || sel.includes(id)) ? '' : 'none';
        });
      }
    });

    function closeModal(){
      modal.style.display = 'none';
      templateSelect.value = 'default';
      templateSelect.dispatchEvent(new Event('change'));
    }
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    saveBtn.addEventListener('click', () => {
      const tname = nameInput.value.trim();
      if (!tname) { alert('Enter a template name'); return; }
      const sel = Array.from(sectionList.querySelectorAll('input[type="checkbox"]:checked'))
                         .map(cb => cb.value);
      templates[tname] = sel;
      localStorage.setItem('formTemplates', JSON.stringify(templates));
      const opt = document.createElement('option');
      opt.value = tname; opt.textContent = tname;
      templateSelect.appendChild(opt);
      templateSelect.value = tname;
      templateSelect.dispatchEvent(new Event('change'));
      closeModal();
    });

    const deleteTemplateBtn = document.getElementById('deleteTemplateBtn');
    if (deleteTemplateBtn) {
      function updateDeleteBtnDisplay() {
        const val = templateSelect.value;
        deleteTemplateBtn.style.display = (val !== 'default' && val !== 'new') ? 'inline-block' : 'none';
      }
      updateDeleteBtnDisplay();
      templateSelect.addEventListener('change', updateDeleteBtnDisplay);

      deleteTemplateBtn.addEventListener('click', function() {
        const current = templateSelect.value;
        if (current === 'default' || current === 'new') {
          alert('Cannot delete this template.');
          return;
        }
        if (confirm(`Delete template "${current}"? This action cannot be undone.`)) {
          delete templates[current];
          localStorage.setItem('formTemplates', JSON.stringify(templates));
          const opt = templateSelect.querySelector(`option[value="${current}"]`);
          if (opt) opt.remove();
          templateSelect.value = 'default';
          templateSelect.dispatchEvent(new Event('change'));
          alert(`Template "${current}" has been deleted.`);
        }
      });
    }

    window.addEventListener('click', e => {
      if (e.target === modal) closeModal();
    });
  })();
});

// Function to initialize drag and drop for form sections
function initDragAndDrop() {
  const draggableSections = document.querySelectorAll('.draggable');
  
  draggableSections.forEach(section => {
    const dragHandle = section.querySelector('.drag-handle');
    
    if (dragHandle) {
      dragHandle.addEventListener('mousedown', (e) => {
        // Prevent default behavior and propagation
        e.preventDefault();
        e.stopPropagation();
        
        // Add dragging class for styling
        section.classList.add('dragging');
        
        // Store original position
        const rect = section.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;
        
        // Get all draggable sections for drop targets
        const allSections = Array.from(document.querySelectorAll('.draggable:not(.dragging)'));
        
        // Function to handle drag movement
        function mouseMoveHandler(e) {
          // Calculate position
          const x = e.clientX - offsetX;
          const y = e.clientY - offsetY;
          
          // Move element (visual feedback only)
          section.style.position = 'fixed';
          section.style.top = `${y}px`;
          section.style.left = `${x}px`;
          section.style.width = `${rect.width}px`;
          section.style.zIndex = 1000;
          
          // Find the drop target
          const dropTarget = findDropTarget(e.clientY, allSections);
          
          // Clear previous drop target highlights
          allSections.forEach(s => s.classList.remove('drop-target'));
          
          // Highlight new drop target
          if (dropTarget) {
            dropTarget.classList.add('drop-target');
          }
        }
        
        // Function to handle drop
        function mouseUpHandler(e) {
          // Remove the dragging class
          section.classList.remove('dragging');
          
          // Reset positioning
          section.style.position = '';
          section.style.top = '';
          section.style.left = '';
          section.style.width = '';
          section.style.zIndex = '';
          
          // Find drop target
          const dropTarget = findDropTarget(e.clientY, allSections);
          
          // Clear drop target highlights
          allSections.forEach(s => s.classList.remove('drop-target'));
          
          // Move the section to the new position
          if (dropTarget) {
            // Determine if we should insert before or after
            const rect = dropTarget.getBoundingClientRect();
            const dropMiddle = rect.top + rect.height / 2;
            
            if (e.clientY < dropMiddle) {
              // Insert before
              dropTarget.parentNode.insertBefore(section, dropTarget);
            } else {
              // Insert after
              dropTarget.parentNode.insertBefore(section, dropTarget.nextSibling);
            }
            
            // Save the current order of sections
            saveLayoutState();
          }
          
          // Remove event listeners
          document.removeEventListener('mousemove', mouseMoveHandler);
          document.removeEventListener('mouseup', mouseUpHandler);
        }
        
        // Add event listeners
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
      });
    }
  });
}

// Simplified Save and Load functionality (no modal needed)
function initSimpleSaveAndLoad() {
  const saveBtn = document.querySelector('.save-btn');
  const loadBtn = document.querySelector('.load-btn');
  
  if (saveBtn) {
    saveBtn.addEventListener('click', function() {
      const reportName = prompt('Enter a name for this report:', `Report_${getCurrentDateString()}`);
      if (reportName) {
        saveFormData(reportName);
      }
    });
  }
  
  if (loadBtn) {
    loadBtn.addEventListener('click', function() {
      // Show list of saved reports
      const savedReports = getSavedReports();
      
      if (savedReports.length === 0) {
        alert('No saved reports found');
        return;
      }
      
      // Create a selection list of reports
      let reportsString = 'Select a report to load:\n\n';
      savedReports.forEach((report, index) => {
        reportsString += `${index + 1}. ${report.name} (${new Date(report.timestamp).toLocaleString()})\n`;
      });
      
      const selection = prompt(reportsString, '1');
      
      if (selection) {
        const reportIndex = parseInt(selection) - 1;
        if (!isNaN(reportIndex) && reportIndex >= 0 && reportIndex < savedReports.length) {
          loadFormData(savedReports[reportIndex].id);
        } else {
          alert('Invalid selection');
        }
      }
    });
  }
  
  // Function to save form data
  function saveFormData(reportName) {
    const form = document.getElementById('inspection-report');
    const formData = new FormData(form);
    const data = {};
    
    // Convert FormData to object
    for (let [key, value] of formData.entries()) {
      // Skip file inputs
      if (key !== 'file-attachments') {
        data[key] = value;
      }
    }
    
    // Get section order
    const sections = document.querySelectorAll('.draggable');
    data._sectionOrder = Array.from(sections).map(section => section.getAttribute('data-section-id'));
    
    // Create report object
    const report = {
      id: Date.now().toString(),
      name: reportName,
      timestamp: Date.now(),
      data: data
    };
    
    // Save to localStorage
    const savedReports = getSavedReports();
    savedReports.push(report);
    localStorage.setItem('savedReports', JSON.stringify(savedReports));
    
    alert(`Report "${reportName}" saved successfully!`);
  }
  
  // Function to load form data
  function loadFormData(reportId) {
    const savedReports = getSavedReports();
    const report = savedReports.find(r => r.id === reportId);
    
    if (!report) {
      alert('Report not found!');
      return;
    }
    
    const form = document.getElementById('inspection-report');
    
    // Reset form first
    form.reset();
    
    // Fill form with saved data
    for (let key in report.data) {
      if (key === '_sectionOrder') continue;
      
      const input = form.elements[key];
      if (input) {
        if (input.type === 'checkbox' || input.type === 'radio') {
          input.checked = report.data[key] === 'on' || report.data[key] === true;
        } else {
          input.value = report.data[key];
        }
      }
    }
    
    // Restore section order if available
    if (report.data._sectionOrder) {
      const container = document.querySelector('form');
      
      report.data._sectionOrder.forEach(sectionId => {
        const section = document.querySelector(`.draggable[data-section-id="${sectionId}"]`);
        if (section) {
          container.appendChild(section);
        }
      });
    }
    
    // Recalculate totals and control number
    calculateTotals();
    generateControlNumber();
    
    alert(`Report "${report.name}" loaded successfully!`);
  }
}

// Initialize file-based save and load functionality
function initFileSaveAndLoad() {
  const saveFileBtn = document.querySelector('.save-file-btn');
  const loadFileBtn = document.querySelector('.load-file-btn');
  const fileInput = document.getElementById('load-report-file');
  
  // Save report to file
  if (saveFileBtn) {
    saveFileBtn.addEventListener('click', function(e) {
      // Prevent default handler
      e.stopPropagation();
      
      // Collect form data
      const form = document.getElementById('inspection-report');
      const formData = new FormData(form);
      const data = {};
      
      // Convert FormData to object
      for (let [key, value] of formData.entries()) {
        // Skip file inputs
        if (key !== 'file-attachments') {
          data[key] = value;
        }
      }
      
      // Get section order
      const sections = document.querySelectorAll('.draggable');
      data._sectionOrder = Array.from(sections).map(section => section.getAttribute('data-section-id'));
      
      // Get image data
      const savedImages = localStorage.getItem('reportImages');
      const imageData = savedImages ? JSON.parse(savedImages) : [];
      
      // Create report object
      const report = {
        name: prompt('Enter a name for this report:', `Report_${getCurrentDateString()}`),
        timestamp: Date.now(),
        data: data,
        imageData: imageData
      };
      
      if (!report.name) return; // User cancelled
      
      // Convert to JSON
      const jsonData = JSON.stringify(report, null, 2);
      
      // Create download link
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${report.name.replace(/\s+/g, '_')}.json`;
      document.body.appendChild(link);
      
      // Download file
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
    }, true);
  }
  
  // Load report from file
  if (loadFileBtn && fileInput) {
    loadFileBtn.addEventListener('click', function() {
      fileInput.click();
    });
    
    // Handle file selection
    fileInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          const report = JSON.parse(e.target.result);
          
          // Validate report format
          if (!report.data) {
            throw new Error('Invalid report format');
          }
          
          // Load report data
          loadReportFromData(report);
          
          // Reset file input
          fileInput.value = '';
          
          alert(`Report "${report.name}" loaded successfully!`);
        } catch (error) {
          alert(`Error loading report: ${error.message}`);
        }
      };
      
      reader.readAsText(file);
    });
  }
}

// Function to initialize the image documentation section
function initImageDocumentation() {
  const addImageBtn = document.querySelector('.add-image-btn');
  const imagesContainer = document.querySelector('.images-container');
  
  if (!addImageBtn || !imagesContainer) return;
  
  // Create a hidden file input for image selection
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/jpeg,image/png,image/gif';
  fileInput.className = 'hidden-file-input';
  fileInput.multiple = false;
  document.body.appendChild(fileInput);
  
  updateNoImagesPlaceholder();
  
  // Handle Add New Image button click
  addImageBtn.addEventListener('click', () => {
    fileInput.click();
  });
  
  // Handle image file selection
  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Check if file is an image
      if (!file.type.match('image.*')) {
        alert('Please select an image file (JPEG, PNG, or GIF).');
        return;
      }
      
      // Read the image file
      const reader = new FileReader();
      reader.onload = (event) => {
        // Remove placeholder if exists
        const placeholder = imagesContainer.querySelector('.no-image-text');
        if (placeholder) {
          placeholder.remove();
        }
        
        // Create a unique ID for this image
        const imageId = 'img_' + Date.now();
        
        // Create image item container
        const imageItem = document.createElement('div');
        imageItem.className = 'image-item';
        imageItem.dataset.imageId = imageId;
        
        // Create image header with title and controls
        const imageHeader = document.createElement('div');
        imageHeader.className = 'image-header';
        
        const imageTitle = document.createElement('h4');
        imageTitle.className = 'image-title';
        imageTitle.textContent = file.name;
        
        const imageControls = document.createElement('div');
        imageControls.className = 'image-controls';
        
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'remove-image-btn';
        removeBtn.innerHTML = '<i class="fas fa-trash"></i> Remove';
        removeBtn.addEventListener('click', () => {
          imageItem.remove();
          updateNoImagesPlaceholder();
          saveImageData(); 
        });
        
        imageControls.appendChild(removeBtn);
        imageHeader.appendChild(imageTitle);
        imageHeader.appendChild(imageControls);
        
        // Create image preview
        const imagePreview = document.createElement('div');
        imagePreview.className = 'image-preview';
        
        const img = document.createElement('img');
        img.src = event.target.result;
        img.alt = file.name;
        
        imagePreview.appendChild(img);
        
        // Create comment area
        const commentContainer = document.createElement('div');
        commentContainer.className = 'image-comment-container';
        
        const commentLabel = document.createElement('label');
        commentLabel.textContent = 'Comments:';
        commentLabel.setAttribute('for', `comment-${imageId}`);
        
        const commentTextarea = document.createElement('textarea');
        commentTextarea.className = 'image-comment';
        commentTextarea.id = `comment-${imageId}`;
        commentTextarea.name = `comment-${imageId}`;
        commentTextarea.placeholder = 'Add your comments about this image here...';
        
        // Save comment when it changes
        commentTextarea.addEventListener('input', saveImageData);
        
        commentContainer.appendChild(commentLabel);
        commentContainer.appendChild(commentTextarea);
        
        // Assemble the image item
        imageItem.appendChild(imageHeader);
        imageItem.appendChild(imagePreview);
        imageItem.appendChild(commentContainer);
        
        // Add the image item to the container
        imagesContainer.appendChild(imageItem);
        
        // Save this image data
        saveImageData();
      };
      
      // Read image as data URL
      reader.readAsDataURL(file);
      
      // Reset the file input
      fileInput.value = '';
    }
  });
}

// Function to initialize Save Form to HTML functionality
function initSaveFormToHTML() {
  const saveHtmlBtn = document.querySelector('.save-html-btn');
  
  if (saveHtmlBtn) {
    saveHtmlBtn.addEventListener('click', function() {
      // Prompt for filename
      const filename = prompt('Enter a name for the HTML file:', `inspection_report_${getCurrentDateString()}`);
      if (!filename) return; 
      
      // Create a clone of the form to manipulate
      const form = document.getElementById('inspection-report');
      const formClone = form.cloneNode(true);
      
      // Create a new document with basic structure
      const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MRC Global Inspection Report - ${filename}</title>
  <style>
    /* Basic styling for the exported form */
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: Arial, sans-serif;
      line-height: 1.4;
      color: #333;
      background-color: #f9f9f9;
      padding: 20px;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background-color: #fff;
      padding: 20px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    
    .header-content {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      border-bottom: 1px solid #003366;
      padding-bottom: 10px;
    }
    
    .logo {
      width: 60px;
      height: auto;
      margin-right: 15px;
    }
    
    h1 {
      color: #003366;
      font-size: 24px;
    }
    
    .form-section {
      margin-bottom: 15px;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 10px;
      background-color: #fafafa;
    }
    
    .section-header {
      margin-bottom: 10px;
    }
    
    h3 {
      color: #003366;
      font-size: 18px;
      border-bottom: 1px solid #eee;
      padding-bottom: 5px;
      margin-bottom: 10px;
    }
    
    .form-row {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 10px;
    }
    
    .form-group {
      flex: 1;
      min-width: 200px;
      margin-right: 10px;
      margin-bottom: 10px;
    }
    
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
      color: #555;
    }
    
    input[type="text"],
    textarea {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 3px;
      background-color: #f9f9f9;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 15px;
    }
    
    th, td {
      padding: 8px;
      border: 1px solid #ddd;
      text-align: left;
    }
    
    th {
      background-color: #f2f2f2;
      font-weight: bold;
    }
    
    .control-number-section {
      background-color: #f0f7ff;
      border-left: 3px solid #003366;
    }
    
    .control-number-input {
      font-weight: bold;
      color: #003366;
    }
    
    .image-item {
      margin-bottom: 20px;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 5px;
    }
    
    .image-header {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
      margin-bottom: 10px;
    }
    
    .image-title {
      font-weight: bold;
      color: #003366;
    }
    
    .image-preview {
      text-align: center;
      margin-bottom: 10px;
    }
    
    .image-preview img {
      max-width: 100%;
      max-height: 400px;
      border: 1px solid #ddd;
    }
    
    .image-comment-container {
      margin-top: 10px;
    }
    
    /* Remove control elements from the exported HTML */
    .drag-handle,
    button,
    .form-actions,
    .dropdown,
    .drop-target,
    .form-toolbar {
      display: none !important;
    }
    
    /* Make checkbox and radio selections visible */
    input[type="checkbox"]:checked::after,
    input[type="radio"]:checked::after {
      content: "✓";
      display: inline-block;
      text-align: center;
      width: 100%;
      height: 100%;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header-content">
      <h1>MRC Global Inspection Report</h1>
      <div style="margin-left: auto; font-size: 14px; color: #666;">
        Exported on: ${new Date().toLocaleString()}
      </div>
    </div>
    <div id="report-content">
      <!-- Form content will be inserted here -->
    </div>
  </div>
</body>
</html>
      `;
      
      // Create a HTML document
      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(htmlContent, 'text/html');
      const reportContainer = htmlDoc.getElementById('report-content');
      
      // Get the control number section
      const controlSection = document.querySelector('.control-number-section').cloneNode(true);
      
      // Remove drag handles and buttons
      controlSection.querySelectorAll('.drag-handle, button').forEach(el => el.remove());
      reportContainer.appendChild(controlSection);
      
      // Process form sections
      formClone.querySelectorAll('.form-section').forEach(section => {
        // Remove drag handles and buttons
        section.querySelectorAll('.drag-handle, button').forEach(el => el.remove());
        reportContainer.appendChild(section);
      });
      
      // Get all form inputs and make them readonly
      htmlDoc.querySelectorAll('input, textarea, select').forEach(input => {
        const originalInput = form.querySelector(`[name="${input.name}"]`);
        if (originalInput) {
          if (originalInput.type === 'checkbox' || originalInput.type === 'radio') {
            input.checked = originalInput.checked;
          } else {
            input.value = originalInput.value;
          }
          input.setAttribute('readonly', 'readonly');
          input.setAttribute('disabled', 'disabled');
        }
      });
      
      // Handle images
      const savedImages = localStorage.getItem('reportImages');
      if (savedImages) {
        try {
          const imageData = JSON.parse(savedImages);
          
          const imagesContainer = htmlDoc.querySelector('.images-container');
          if (imagesContainer) {
            // Clear any placeholder
            imagesContainer.innerHTML = '';
            
            // Add each image
            imageData.forEach(imgData => {
              const imageItem = document.createElement('div');
              imageItem.className = 'image-item';
              
              const imageHeader = document.createElement('div');
              imageHeader.className = 'image-header';
              
              const imageTitle = document.createElement('h4');
              imageTitle.className = 'image-title';
              imageTitle.textContent = imgData.filename;
              
              imageHeader.appendChild(imageTitle);
              
              const imagePreview = document.createElement('div');
              imagePreview.className = 'image-preview';
              
              const img = document.createElement('img');
              img.src = imgData.image;
              img.alt = imgData.filename;
              
              imagePreview.appendChild(img);
              
              const commentContainer = document.createElement('div');
              commentContainer.className = 'image-comment-container';
              
              const commentLabel = document.createElement('label');
              commentLabel.textContent = 'Comments:';
              
              const commentText = document.createElement('div');
              commentText.className = 'image-comment-text';
              commentText.textContent = imgData.comment || '';
              
              commentContainer.appendChild(commentLabel);
              commentContainer.appendChild(commentText);
              
              imageItem.appendChild(imageHeader);
              imageItem.appendChild(imagePreview);
              imageItem.appendChild(commentContainer);
              
              imagesContainer.appendChild(imageItem);
            });
          }
        } catch (error) {
          console.error('Error processing images for HTML export:', error);
        }
      }
      
      // Create a Blob with the HTML content
      const blob = new Blob([htmlDoc.documentElement.outerHTML], { type: 'text/html' });
      
      // Create a download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.html`;
      document.body.appendChild(link);
      
      // Download the HTML file
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
    });
  }
}

// Function to initialize table row management
function initTableRowManagement() {
  // Add functionality to all tables that should support dynamic rows
  // Item Details is now transposed, so it doesn't use this standard dynamic table init
  // initDynamicTable('.item-details', 'Item'); // This is now handled by transpose logic if needed

  // Document References tables are handled by specific add/delete logic
  // initDynamicTable('.additional-documents', 'Document'); // Use specific add/delete for consistency with Document References
  initDynamicTable('.contact-table', 'Contact'); // This uses standard dynamic row logic
  initDynamicTable('.calibration-table', 'Calibration'); // This uses standard dynamic row logic

  // Add delete selected functionality for Document References tables
  initDeleteSelectedDocuments('.document-references');

  // Add "Add New Document" functionality specifically for document references
  const addDocumentBtn = document.querySelector('.add-document-btn');
  if (addDocumentBtn) {
      // Remove any existing listeners to prevent duplicates if script re-runs
       const oldBtn = addDocumentBtn.cloneNode(true);
       addDocumentBtn.parentNode.replaceChild(oldBtn, addDocumentBtn);
       const newBtn = oldBtn; // Use the newly created element

      newBtn.addEventListener('click', function() {
          // Find the correct table - assuming it's within the same form section
          const table = this.closest('.form-section')?.querySelector('.document-references');
          if (table) {
              addDocumentReferenceRow(table);
          } else {
              console.error('Document References table not found for Add button.');
          }
      });
  }

   // Add delete selected functionality for Additional Documents table
   initDeleteSelectedDocuments('.additional-documents');

   // Add "Add New Document" functionality specifically for additional documents
   const addAdditionalDocumentBtn = document.querySelector('.additional-documents + .add-row-btn'); // Assuming the button is immediately after the table
   if (addAdditionalDocumentBtn) {
        // Remove any existing listeners
       const oldBtn = addAdditionalDocumentBtn.cloneNode(true);
       addAdditionalDocumentBtn.parentNode.replaceChild(oldBtn, addAdditionalDocumentBtn);
       const newBtn = oldBtn;

       // Update text to be more specific
        newBtn.innerHTML = `<i class="fas fa-plus-circle"></i> Add Additional Document Row`;

       newBtn.addEventListener('click', function() {
            const table = this.previousElementSibling; // Assumes button is right after the table
            if (table && table.classList.contains('additional-documents')) {
                 addDocumentReferenceRow(table); // Use the same helper function
            } else {
                 console.error('Additional Documents table not found for Add button.');
            }
       });
   }

}

// Function to make a specific table support adding/removing rows
function initDynamicTable(tableSelector, rowType) {
  const tables = document.querySelectorAll(tableSelector);

  tables.forEach(table => {
    // Check if a button for this table already exists to avoid duplication
    const existingButton = table.parentNode.querySelector(`.add-row-btn[data-table-selector="${tableSelector}"]`);
    if (existingButton) {
       // Update its text if necessary and ensure it has the data attribute
        existingButton.innerHTML = `<i class="fas fa-plus-circle"></i> Add ${rowType} Row`;
        existingButton.setAttribute('data-table-selector', tableSelector);
        // Remove existing event listener to prevent duplicates
        const oldButton = existingButton.cloneNode(true);
        existingButton.parentNode.replaceChild(oldButton, existingButton);
        const newButton = oldButton; // Use the newly created element

         // Add the click event listener to the existing/replaced button
        newButton.addEventListener('click', function() {
            addDynamicTableRow(table, tableSelector);
        });

    } else {
         // Create and add the "Add Row" button after the table
        const addRowBtn = document.createElement('button');
        addRowBtn.type = 'button';
        addRowBtn.className = 'add-row-btn';
        addRowBtn.setAttribute('data-table-selector', tableSelector); // Mark the button for this table
        addRowBtn.innerHTML = `<i class="fas fa-plus-circle"></i> Add ${rowType} Row`;
        addRowBtn.style.marginTop = '10px';
        addRowBtn.style.marginBottom = '20px';

        // Insert the button after the table
        table.parentNode.insertBefore(addRowBtn, table.nextSibling);

        // Add click event for the "Add Row" button
        addRowBtn.addEventListener('click', function() {
            addDynamicTableRow(table, tableSelector);
        });
    }


    // Add delete buttons to initial rows IF the table is supposed to have an actions column
     const headerCells = table.querySelectorAll('thead th');
     let hasActionHeader = false;
     headerCells.forEach(th => {
         if (th.textContent.trim().toLowerCase() === 'actions') {
             hasActionHeader = true;
         }
     });

     if (hasActionHeader) {
         const rows = table.querySelectorAll('tbody tr');
         // Add delete buttons to all initial rows except the first one (to keep a template if needed)
         // Or just add to all? Let's add to all, the "Cannot delete last row" handles the template case.
         rows.forEach(row => {
             addDeleteButton(row);
         });
     }
  });
}

// Function to add a row to a dynamic table
function addDynamicTableRow(table, tableSelector) {
    const tbody = table.querySelector('tbody');
    if (!tbody) return;

    // Find a template row. Prioritize rows with "-template" in the name.
    let templateRow = tbody.querySelector('tr input[name$="-template"]')?.closest('tr');

     // Fallback: if no explicit template, use the last non-empty row as a template
    if (!templateRow) {
         const nonTemplateRows = tbody.querySelectorAll('tr');
         if (nonTemplateRows.length > 0) {
              templateRow = nonTemplateRows[nonTemplateRows.length - 1];
         }
    }

    if (!templateRow) {
        console.error(`Cannot add row: No template row found for table ${tableSelector}`);
        return; // Cannot add row without a template
    }

    const newRow = templateRow.cloneNode(true);

    // Clear input values and update names/ids
    newRow.querySelectorAll('input, textarea, select').forEach(input => {
        if (input.type === 'checkbox' || input.type === 'radio') {
           input.checked = false;
        } else {
           input.value = '';
        }

        // Update the input name with a new index
        const nameParts = input.name.split('-');
        // Check if the last part is a number or "template"
        if (nameParts.length > 1 && (nameParts[nameParts.length - 1] === 'template' || !isNaN(nameParts[nameParts.length - 1]))) {
          // Find the current highest index for this name root across all rows in all tables with the same selector
          let highestIndex = 0;
           // Get the base name without the index/template suffix
          const baseName = nameParts.slice(0, -1).join('-');

          document.querySelectorAll(tableSelector + ' tbody tr').forEach(existingRow => {
              // Find the input in the existing row that has the same base name
              const existingInput = existingRow.querySelector(`[name="${baseName}-"]`);
              if (existingInput) {
                   const existingNameParts = existingInput.name.split('-');
                   if (existingNameParts.length > 1 && !isNaN(existingNameParts[existingNameParts.length - 1])) {
                       highestIndex = Math.max(highestIndex, parseInt(existingNameParts[existingNameParts.length - 1]));
                   }
              }
          });

          const newIndex = highestIndex + 1;
          nameParts[nameParts.length - 1] = newIndex.toString();
          input.name = nameParts.join('-');
          input.id = nameParts.join('-'); // Update ID as well
        }
    });

    // Add a delete button to the new row (addDeleteButton will handle if table should have one)
    addDeleteButton(newRow);

     // Append the new row before any template rows if they exist, otherwise at the end
    const templateRowElement = tbody.querySelector('tr input[name$="-template"]')?.closest('tr');
    if (templateRowElement) {
        tbody.insertBefore(newRow, templateRowElement);
    } else {
         tbody.appendChild(newRow);
    }
}

// Function to add a delete button to a table row
function addDeleteButton(row) {
  // Check if the row already has a delete button
  if (row.querySelector('.delete-row-btn')) {
    return;
  }

  const table = row.closest('table');
  if (!table) return;

  // Check if the table's header has an "Actions" column
  const headerCells = table.querySelectorAll('thead th');
  let hasActionHeader = false;
  headerCells.forEach(th => {
    if (th.textContent.trim().toLowerCase() === 'actions') {
      hasActionHeader = true;
    }
  });

  // If the original header didn't have an actions column, don't add one here
  if (!hasActionHeader) {
      // Check if the row *already* has a cell count that matches the header count
      // If so, and no action header exists, don't add another cell.
      const headerCount = table.querySelectorAll('thead th').length;
      const cellCount = row.querySelectorAll('td').length;
      if (cellCount >= headerCount) { // Use >= in case some rows were already modified
          return; // Table doesn't have actions column, don't add a button/cell
      }
  }


  // Get the last cell or create one if needed (only if the table is supposed to have actions)
   let actionCell = row.querySelector('.action-cell'); // Try to find an existing action cell
    if (!actionCell) {
        // If no existing cell, but table is supposed to have actions, create one
        if (hasActionHeader) {
             actionCell = document.createElement('td');
             actionCell.className = 'action-cell';
             row.appendChild(actionCell);
        } else {
            // If no existing cell and table is NOT supposed to have actions, do nothing
            return;
        }
    }


  // Create the delete button
  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.className = 'delete-row-btn';
  deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
  deleteBtn.title = 'Delete Row';
  deleteBtn.style.background = '#dc3545';
  deleteBtn.style.color = 'white';
  deleteBtn.style.border = 'none';
  deleteBtn.style.borderRadius = '3px';
  deleteBtn.style.padding = '3px 6px';
  deleteBtn.style.cursor = 'pointer';
    deleteBtn.style.display = 'inline-flex'; // Ensure flex display for icon
    deleteBtn.style.alignItems = 'center';


  // Add event listener
  deleteBtn.addEventListener('click', function() {
    // Ensure we don't delete the last remaining row if it's needed as a template
    const tbody = row.closest('tbody');
    if (tbody) {
        const rows = tbody.querySelectorAll('tr:not(:has(input[name$="-template"]))'); // Count non-template rows
        if (rows.length <= 1) {
            alert("Cannot delete the last row.");
            return;
        }
    }

    if (confirm('Are you sure you want to delete this row?')) {
      row.remove();
       // If the table has a "delete selected" button, re-initialize its state if needed (e.g. disable if no rows left)
       const deleteSelectedBtn = table.closest('.form-section')?.querySelector('.delete-selected-docs-btn');
        if(deleteSelectedBtn) {
             // Simple re-initialization, can be more complex if needed
             initDeleteSelectedDocuments(table.closest('.form-section').querySelector('table').classList[0]); // Pass the table class
        }
    }
  });

  // Clear existing content in the action cell and add the delete button
  actionCell.innerHTML = '';
  actionCell.appendChild(deleteBtn);
}

// Function to initialize delete selected functionality for a specific table selector
function initDeleteSelectedDocuments(tableSelector) {
    // Find the delete selected button associated with this table section
     const deleteButton = document.querySelector(`${tableSelector} + .delete-selected-docs-btn`);

    if (!deleteButton) {
        // If the button doesn't exist, check if a generic delete selected button is present
        const genericDeleteButton = document.querySelector('.delete-selected-docs-btn:not([data-table-selector])');
        if (genericDeleteButton && tableSelector === '.document-references') {
             // If it's the main document references section and there's a generic button, use that
              initGenericDeleteSelected(genericDeleteButton, tableSelector);
             return;
        }
        return; // No specific delete button for this table selector
    }

    // Remove any existing listeners
    const oldBtn = deleteButton.cloneNode(true);
    deleteButton.parentNode.replaceChild(oldBtn, deleteButton);
    const newButton = oldBtn; // Use the newly created element

    // Add a data attribute to link button to table selector
     newButton.setAttribute('data-table-selector', tableSelector);


    newButton.addEventListener('click', function() {
        const table = this.previousElementSibling; // Assumes the button is right after the table
        if (!table || !table.matches(tableSelector)) {
             console.error(`Target table ${tableSelector} not found for delete selected button.`);
             return;
        }

        const rows = table.querySelectorAll('tbody tr');
        let rowsToDelete = [];
        let deletedCount = 0;

        rows.forEach(row => {
            const checkbox = row.querySelector('input[type="checkbox"]');
             // Ensure we don't delete the last non-template row
            const tbody = row.closest('tbody');
             const nonTemplateRows = tbody ? tbody.querySelectorAll('tr:not(:has(input[name$="-template"]))') : [];

            if (checkbox && checkbox.checked) {
                 if (nonTemplateRows.length > 1 || row.querySelector('input[name$="-template"]')) {
                      rowsToDelete.push(row);
                 } else {
                     alert("Cannot delete the last remaining row.");
                 }
            }
        });

        if (rowsToDelete.length === 0 && rows.length > 0) { // Check if rows exist but none selected
            alert('No documents selected for deletion.');
            return;
        } else if (rowsToDelete.length === 0 && rows.length === 0) { // No rows at all
             alert('No data to delete.');
             return;
        }


        if (confirm(`Are you sure you want to delete ${rowsToDelete.length} selected documents?`)) {
            rowsToDelete.forEach(row => {
                // Ensure it's still a child of the correct table's tbody before removing
                if (row.closest('tbody') === table.querySelector('tbody')) {
                     row.remove();
                     deletedCount++;
                }
            });
            alert(`${deletedCount} documents deleted.`);
        }
    });
}

// Function to add a row specifically to document reference tables
function addDocumentReferenceRow(table) {
    const tbody = table.querySelector('tbody');
    if (!tbody) return;

    // Find the template row (the one with '-template' in input names)
    let templateRow = tbody.querySelector('tr input[name$="-template"]')?.closest('tr');

     // Fallback: if no explicit template, use the last non-empty row as a template
    if (!templateRow) {
         const nonTemplateRows = tbody.querySelectorAll('tr');
         if (nonTemplateRows.length > 0) {
              templateRow = nonTemplateRows[nonTemplateRows.length - 1];
         }
    }


    if (!templateRow) {
        console.error(`Cannot add row: No template row found for table ${table.className}`);
        return; // Cannot add row without a template
    }

    const newRow = templateRow.cloneNode(true);

    // Clear input values and update names/ids
    newRow.querySelectorAll('input, textarea, select').forEach(input => {
        if (input.type === 'checkbox') { // Only checkbox in the first column needs handling
           input.checked = false;
           // Update the input name with a new index
           const nameParts = input.name.split('-');
            if (nameParts.length > 1 && (nameParts[nameParts.length - 1] === 'template' || !isNaN(nameParts[nameParts.length - 1]))) {
                // Find the current highest index for the 'select' name across this table
                 let highestIndex = 0;
                 table.querySelectorAll('tbody tr').forEach(existingRow => {
                    const existingInput = existingRow.querySelector(`input[name^="${nameParts.slice(0, -1).join('-')}-"]`);
                    if (existingInput) {
                        const existingNameParts = existingInput.name.split('-');
                         if (existingNameParts.length > 1 && !isNaN(existingNameParts[existingNameParts.length - 1])) {
                            highestIndex = Math.max(highestIndex, parseInt(existingNameParts[existingNameParts.length - 1]));
                         }
                    }
                 });
                 const newIndex = highestIndex + 1;
                 nameParts[nameParts.length - 1] = newIndex.toString();
                 input.name = nameParts.join('-');
                 input.id = nameParts.join('-'); // Update ID as well
            }


        } else if (input.type === 'text') { // Handle text inputs for Document N° and Title
             input.value = '';

             // Update the input name with a new index
             const nameParts = input.name.split('-');
              // Get the base name (e.g., 'doc-num' or 'doc-title')
             const baseName = nameParts.slice(0, -1).join('-');

             if (nameParts.length > 1 && (nameParts[nameParts.length - 1] === 'template' || nameParts[nameParts.length - 1] === 'template-2' || !isNaN(nameParts[nameParts.length - 1]))) {
                 // Find the highest index for the specific name root (e.g., 'doc-num') across the table
                 let highestIndex = 0;
                  table.querySelectorAll('tbody tr').forEach(existingRow => {
                      const existingInput = existingRow.querySelector(`input[name^="${baseName}-"]`);
                      if (existingInput) {
                          const existingNameParts = existingInput.name.split('-');
                           if (existingNameParts.length > 1 && !isNaN(existingNameParts[existingNameParts.length - 1])) {
                               highestIndex = Math.max(highestIndex, parseInt(existingNameParts[existingNameParts.length - 1]));
                           }
                      }
                  });

                  const newIndex = highestIndex + 1;
                   // Rebuild the name with the new index, preserving the original suffix type if it existed (like '-2' for the second table)
                   let newName = baseName + '-' + newIndex.toString();
                   // Check if the original template name had a specific table suffix like '-template-2'
                   if (nameParts.length > 2 && nameParts[nameParts.length - 2] === 'template' && nameParts[nameParts.length - 1] === '2') {
                       // If the template came from the second table, ensure new names are unique across both
                        // We already found the highest index across both, so just use the newIndex.
                        // The name format should be consistent across both tables for uniqueness
                        newName = baseName + '-' + newIndex.toString(); // doc-num-21, doc-title-21
                   } else if (nameParts.length > 1 && nameParts[nameParts.length - 1] === 'template') {
                        // If the template came from the first table
                         newName = baseName + '-' + newIndex.toString(); // doc-num-21, doc-title-21
                   }

                  input.name = newName;
                  input.id = newName; // Update ID as well
             }

        } else {
             // Clear other input types if any (like textareas)
             input.value = '';
             // Re-index textarea names/ids if applicable
              const nameParts = input.name.split('-');
             if (nameParts.length > 1 && (nameParts[nameParts.length - 1] === 'template' || nameParts[nameParts.length - 1] === 'template-2' || !isNaN(nameParts[nameParts.length - 1]))) {
                 const baseName = nameParts.slice(0, -1).join('-');
                  let highestIndex = 0;
                  document.querySelectorAll(table.closest('.form-section').querySelector('table').classList[0] + ' tbody tr').forEach(existingRow => {
                       const existingInput = existingRow.querySelector(`[name="${baseName}-"]`);
                       if (existingInput) {
                           const existingNameParts = existingInput.name.split('-');
                            if (existingNameParts.length > 1 && !isNaN(existingNameParts[existingNameParts.length - 1])) {
                                highestIndex = Math.max(highestIndex, parseInt(existingNameParts[existingNameParts.length - 1]));
                            }
                       }
                  });
                   const newIndex = highestIndex + 1;
                    let newName = baseName + '-' + newIndex.toString();
                    if (nameParts.length > 2 && nameParts[nameParts.length - 2] === 'template' && nameParts[nameParts.length - 1] === '2') {
                       newName = baseName + '-' + newIndex.toString();
                    } else if (nameParts.length > 1 && nameParts[nameParts.length - 1] === 'template') {
                       newName = baseName + '-' + newIndex.toString();
                    } else if (nameParts.length > 1 && nameParts[nameParts.length - 1] === 'template-2') {
                        newName = baseName + '-' + newIndex.toString();
                    }
                  input.name = newName;
                  input.id = newName; // Update ID as well
             }
        }
    });

    // Add a delete button to the new row
    addDeleteButton(newRow);

     // Append the new row before any template rows if they exist, otherwise at the end
    const templateRowElement = tbody.querySelector('tr input[name$="-template"]')?.closest('tr');
    if (templateRowElement) {
        tbody.insertBefore(newRow, templateRowElement);
    } else {
         tbody.appendChild(newRow);
    }
}

// Function to initialize delete selected functionality for a generic button
function initGenericDeleteSelected(button, tableSelector) {
    // Remove any existing listeners
    const oldBtn = button.cloneNode(true);
    button.parentNode.replaceChild(oldBtn, button);
    const newButton = oldBtn;

    newButton.addEventListener('click', function() {
        const tables = document.querySelectorAll(tableSelector);
        let rowsToDelete = [];
        let deletedCount = 0;

        tables.forEach(table => {
            const rows = table.querySelectorAll('tbody tr');
            rows.forEach(row => {
                const checkbox = row.querySelector('input[type="checkbox"]');
                if (checkbox && checkbox.checked) {
                    rowsToDelete.push(row);
                }
            });
        });

        if (rowsToDelete.length === 0) {
            alert('No documents selected for deletion.');
            return;
        }

        if (confirm(`Are you sure you want to delete ${rowsToDelete.length} selected documents?`)) {
            rowsToDelete.forEach(row => {
                row.remove();
                deletedCount++;
            });
            alert(`${deletedCount} documents deleted.`);
        }
    });
}

// Function to check if any checkbox is checked in a given table selector and enable/disable button
function checkAnyCheckboxChecked(tableSelector) {
     const deleteButton = document.querySelector(`.delete-selected-docs-btn[data-table-selector="${tableSelector}"]`);
     if (!deleteButton) return;

     const checkboxes = document.querySelectorAll(`${tableSelector} input[type="checkbox"]`);
     let isAnyChecked = false;
     checkboxes.forEach(checkbox => {
         if (checkbox.checked) {
             isAnyChecked = true;
         }
     });

     deleteButton.disabled = !isAnyChecked;
     deleteButton.style.opacity = isAnyChecked ? '1' : '0.5';
     deleteButton.style.cursor = isAnyChecked ? 'pointer' : 'not-allowed';
}

// parse and load Custom Inspection CSV
function parseCustomCsv(csv) {
  const section = document.querySelector('[data-section-id="custom-inspection"]');
  if (!section) return;
  const tbody = section.querySelector('table tbody');
  tbody.innerHTML = '';
  const lines = csv.trim().split('\n').map(l=>l.trim()).filter(l=>l);
  lines.forEach((line,i) => {
    const cols = line.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map(c=>c.replace(/^"(.*)"$/,'$1').trim());
    if (i===0 && cols[0].toLowerCase().includes('category')) return;
    const [category, desc, result, guidance] = cols;
    if (category && !desc) {
      const tr = document.createElement('tr');
      tr.className = 'category-row';
      const td = document.createElement('td');
      td.colSpan = 6;
      td.textContent = category;
      tr.appendChild(td);
      tbody.appendChild(tr);
    } else {
      const id = 'cust-' + Date.now() + '-' + Math.random().toString(36).substr(2,4);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td></td>
        <td contenteditable="true">${desc||''}</td>
        <td><input type="radio" name="${id}" value="pass" ${result==='pass'?'checked':''}></td>
        <td><input type="radio" name="${id}" value="fail" ${result==='fail'?'checked':''}></td>
        <td><input type="radio" name="${id}" value="na" ${result==='na'?'checked':''}></td>
        <td contenteditable="true">${guidance||''}</td>
      `;
      tbody.appendChild(tr);
    }
  });
}