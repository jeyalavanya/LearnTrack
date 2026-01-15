/**
 * STUDENT REGISTRATION SYSTEM - JAVASCRIPT FILE
 * File: student-form.js
 * Features: localStorage persistence, form validation, CRUD operations
 * Responsive action buttons: Text on desktop, icons on mobile/tablet
 */

// ============================================================================
// GLOBAL VARIABLES & INITIALIZATION
// ============================================================================

// Array of all students - Loaded from localStorage on page load (persists after refresh)
// Empty array fallback if no data exists
let students = JSON.parse(localStorage.getItem("students")) || [];

// Tracks which student is being edited (-1 = add new mode)
let editingIndex = -1;

// Form and table elements for DOM manipulation
const form = document.getElementById("studentForm");
const tableBody = document.getElementById("studentTableBody");
const submitBtn = document.getElementById("submitBtn");
const clearBtn = document.getElementById("clearBtn");

// ============================================================================
// REGEX VALIDATION PATTERNS
// ============================================================================

// Input validation rules for real-time form checking
const patterns = {
  // Name: Letters and spaces only
  name: /^[a-zA-Z\s]+$/,
  // ID & Class: Numbers only
  id: /^\d+$/,
  // Email: Standard email format
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  // Contact: 10+ digits (Indian phone numbers)
  contact: /^\d{10,}$/,
  // Badge: Not used in patterns (handled in validateForm array)
  badge: /^[a-zA-Z\s]+$/
};

// ============================================================================
// PAGE INITIALIZATION
// ============================================================================

// Load and display existing students from localStorage when page loads
displayStudents();

// ============================================================================
// EVENT LISTENERS
// ============================================================================

// Form submission: Validate → Save → Update table
form.addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent page reload
  if (validateForm()) { // All fields valid?
    saveStudent();
  }
});

// Clear button: Reset form and exit edit mode
clearBtn.addEventListener("click", clearForm);

// ============================================================================
// FORM VALIDATION (Real-time feedback)
// ============================================================================

/**
 * Validates all form fields using regex patterns
 * Shows/hides error messages with red border highlighting
 * @returns {boolean} true if all fields valid
 */
function validateForm() {
  let isValid = true;
  
  // Field definitions: ID, regex pattern, error message
  const fields = [
    { id: "name", pattern: patterns.name, msg: "Name should contain only characters" },
    { id: "id", pattern: patterns.id, msg: "ID should be numbers only" },
    { id: "class", pattern: patterns.id, msg: "Class should be numbers only" },
    { id: "badge", pattern: /^(Silver|Gold|Platinum)$/, msg: "Select a valid badge level" },
    { id: "email", pattern: patterns.email, msg: "Enter valid email" },
    { id: "contact", pattern: patterns.contact, msg: "Contact must be at least 10 digits" }
  ];

  // Check each field
  fields.forEach((field) => {
    const input = document.getElementById(field.id);
    const error = document.getElementById(field.id + "Error");
    
    // Clear previous errors
    input.classList.remove("error");
    error.style.display = "none";

    // Validate current value
    if (!field.pattern.test(input.value.trim())) {
      // Show error styling
      input.classList.add("error");
      error.textContent = field.msg;
      error.style.display = "block";
      isValid = false;
    }
  });

  return isValid;
}

// ============================================================================
// CRUD OPERATIONS
// ============================================================================

/**
 * Saves student data to localStorage
 * Add: pushes new record
 * Edit: updates existing record at editingIndex
 */
function saveStudent() {
  // Collect form data
  const student = {
    name: document.getElementById("name").value.trim(),
    id: document.getElementById("id").value.trim(),
    class: document.getElementById("class").value.trim(),
    badge: document.getElementById("badge").value.trim(),
    email: document.getElementById("email").value.trim(),
    contact: document.getElementById("contact").value.trim()
  };

  // Edit mode: Replace existing record
  if (editingIndex >= 0) {
    students[editingIndex] = student;
    editingIndex = -1; // Exit edit mode
    submitBtn.textContent = "Add Student"; // Reset button text
  } else {
    // Add mode: Append new record
    students.push(student);
  }

  // PERSISTENCE: Save to localStorage (survives page refresh)
  localStorage.setItem("students", JSON.stringify(students));
  
  // Refresh display and clear form
  displayStudents();
  clearForm();
}

/**
 * Populates table with students array data
 * Creates responsive rows with badge styling and action buttons
 */
function displayStudents() {
  // Clear existing rows
  tableBody.innerHTML = "";
  
  // Create row for each student
  students.forEach((student, index) => {
    const row = document.createElement("tr");
    
    // Dynamic row with badge styling and responsive action buttons
    row.innerHTML = `
      <td>${student.name}</td>
      <td>${student.id}</td>
      <td>${student.class}</td>
      <td>
        <span class="badge badge-${student.badge.toLowerCase()}">
          ${student.badge}
        </span>
      </td>
      <td>${student.email}</td>
      <td>${student.contact}</td>
      <td class="actions">
        <!-- Responsive: Text buttons on desktop, icons on mobile -->
        <button class="edit-btn action-icon edit-icon" onclick="editStudent(${index})" title="Edit">
          <span class="icon-only">✎</span>
          <span class="text-only">Edit</span>
        </button>
        <button class="delete-btn action-icon delete-icon" onclick="deleteStudent(${index})" title="Delete">
          <span class="icon-only">🗑</span>
          <span class="text-only">Delete</span>
        </button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

/**
 * Populates form with selected student data for editing
 * @param {number} index - Index of student to edit
 */
function editStudent(index) {
  const student = students[index];
  
  // Fill form fields
  document.getElementById("name").value = student.name;
  document.getElementById("id").value = student.id;
  document.getElementById("class").value = student.class;
  document.getElementById("badge").value = student.badge;
  document.getElementById("email").value = student.email;
  document.getElementById("contact").value = student.contact;
  
  // Enter edit mode
  editingIndex = index;
  submitBtn.textContent = "Update Student";
  document.getElementById("name").focus(); // Focus first field
}

/**
 * Deletes student after confirmation
 * @param {number} index - Index of student to delete
 */
function deleteStudent(index) {
  if (confirm("Are you sure you want to delete this student?")) {
    students.splice(index, 1); // Remove from array
    localStorage.setItem("students", JSON.stringify(students)); // Update storage
    displayStudents(); // Refresh table
  }
}

/**
 * Resets form to add-new mode
 * Clears validation errors
 */
function clearForm() {
  form.reset(); // Clear all inputs
  editingIndex = -1; // Exit edit mode
  submitBtn.textContent = "Add Student"; // Reset button
  clearErrors(); // Remove error styling
}

/**
 * Removes all validation error styling and messages
 */
function clearErrors() {
  // Clear input borders
  document.querySelectorAll("input").forEach((input) => 
    input.classList.remove("error")
  );
  // Hide error messages
  document.querySelectorAll(".error-msg").forEach((error) => {
    error.style.display = "none";
    error.textContent = "";
  });
}
