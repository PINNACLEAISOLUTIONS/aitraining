// Application Data
const appData = {
  "llmModels": [
    {
      "name": "GPT-4.5",
      "developer": "OpenAI",
      "parameters": "Unknown",
      "accessType": "API",
      "capabilities": "Text generation, reasoning, coding",
      "apiLink": "https://platform.openai.com/docs",
      "description": "Latest flagship GPT model for complex tasks"
    },
    {
      "name": "GPT-o3",
      "developer": "OpenAI", 
      "parameters": "Unknown",
      "accessType": "API",
      "capabilities": "Advanced reasoning, complex problem solving",
      "apiLink": "https://platform.openai.com/docs",
      "description": "Most powerful reasoning model from OpenAI"
    },
    {
      "name": "Claude 3.7 Sonnet",
      "developer": "Anthropic",
      "parameters": "200B+",
      "accessType": "API",
      "capabilities": "Constitutional AI, long context, ethical reasoning",
      "apiLink": "https://docs.anthropic.com/en/home",
      "description": "Advanced language model with built-in ethical principles"
    },
    {
      "name": "Gemini 2.5 Pro",
      "developer": "Google DeepMind",
      "parameters": "Unknown",
      "accessType": "API",
      "capabilities": "Multimodal, reasoning, code generation",
      "apiLink": "https://ai.google.dev/gemini-api/docs",
      "description": "Google's most intelligent AI model with reasoning capabilities"
    },
    {
      "name": "Grok-3",
      "developer": "xAI",
      "parameters": "Unknown",
      "accessType": "API",
      "capabilities": "Real-time information, wit, reasoning",
      "apiLink": "https://x.ai",
      "description": "Elon Musk's AI with real-time knowledge and humor"
    },
    {
      "name": "Llama 3.1",
      "developer": "Meta AI",
      "parameters": "405B",
      "accessType": "Open Source",
      "capabilities": "Code generation, reasoning, multilingual",
      "apiLink": "https://llama.meta.com",
      "description": "Meta's largest open-source language model"
    },
    {
      "name": "DeepSeek R1",
      "developer": "DeepSeek",
      "parameters": "671B (37B active)",
      "accessType": "API & Open Source",
      "capabilities": "Logical reasoning, fine-tuned tasks",
      "apiLink": "https://deepseek.com",
      "description": "Advanced reasoning model with mixture of experts architecture"
    },
    {
      "name": "Mistral Large 2",
      "developer": "Mistral AI",
      "parameters": "123B",
      "accessType": "API",
      "capabilities": "Code generation, reasoning, multilingual",
      "apiLink": "https://mistral.ai",
      "description": "European AI leader's flagship model"
    },
    {
      "name": "Qwen 2.5-Max",
      "developer": "Alibaba",
      "parameters": "Unknown",
      "accessType": "API",
      "capabilities": "Multilingual, reasoning, specialized tasks",
      "apiLink": "https://qwen.alibaba.com",
      "description": "Alibaba's most advanced language model"
    }
  ]
};

// State management
let currentFilters = {
  developer: '',
  accessType: ''
};

let searchResults = [];
let isSearching = false;

// DOM elements
const themeToggle = document.getElementById('theme-toggle');
const globalSearch = document.getElementById('global-search');
const modelsGrid = document.getElementById('models-grid');
const developerFilter = document.getElementById('developer-filter');
const accessFilter = document.getElementById('access-filter');
const clearFiltersBtn = document.getElementById('clear-filters');

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
  initializeTheme();
  initializeNavigation();
  initializeSearch();
  initializeFilters();
  initializeTabs();
  renderModels();
  addScrollAnimations();
});

// Theme Management
function initializeTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-color-scheme', savedTheme);
  updateThemeToggle(savedTheme);
  
  themeToggle.addEventListener('click', toggleTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-color-scheme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-color-scheme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeToggle(newTheme);
}

function updateThemeToggle(theme) {
  themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// Navigation
function initializeNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Update active nav link on scroll
  window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  let currentSection = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.offsetHeight;
    
    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      currentSection = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
}

// Search Functionality
function initializeSearch() {
  let searchTimeout;
  
  globalSearch.addEventListener('input', function() {
    clearTimeout(searchTimeout);
    const query = this.value.trim();
    
    if (query.length > 0) {
      searchTimeout = setTimeout(() => performSearch(query), 300);
    } else {
      hideSearchResults();
    }
  });
  
  globalSearch.addEventListener('blur', function() {
    setTimeout(hideSearchResults, 200);
  });
}

function performSearch(query) {
  const results = [];
  const lowercaseQuery = query.toLowerCase();
  
  // Search models
  appData.llmModels.forEach(model => {
    if (model.name.toLowerCase().includes(lowercaseQuery) ||
        model.developer.toLowerCase().includes(lowercaseQuery) ||
        model.capabilities.toLowerCase().includes(lowercaseQuery) ||
        model.description.toLowerCase().includes(lowercaseQuery)) {
      results.push({
        title: model.name,
        type: 'LLM Model',
        description: model.description,
        action: () => scrollToModel(model.name)
      });
    }
  });
  
  // Search topics from roadmap
  const topics = [
    'Machine Learning', 'Deep Learning', 'Neural Networks', 'Python',
    'Natural Language Processing', 'Computer Vision', 'Transformers',
    'Reinforcement Learning', 'MLOps'
  ];
  
  topics.forEach(topic => {
    if (topic.toLowerCase().includes(lowercaseQuery)) {
      results.push({
        title: topic,
        type: 'Learning Topic',
        description: `Learn about ${topic}`,
        action: () => scrollToSection('roadmap')
      });
    }
  });
  
  showSearchResults(results);
}

function showSearchResults(results) {
  hideSearchResults();
  
  if (results.length === 0) {
    return;
  }
  
  const searchContainer = document.querySelector('.search-container');
  const resultsContainer = document.createElement('div');
  resultsContainer.className = 'search-results';
  resultsContainer.id = 'search-results';
  
  results.slice(0, 5).forEach(result => {
    const resultItem = document.createElement('div');
    resultItem.className = 'search-result-item';
    resultItem.innerHTML = `
      <div class="search-result-title">${result.title}</div>
      <div class="search-result-type">${result.type}</div>
    `;
    
    resultItem.addEventListener('click', () => {
      result.action();
      hideSearchResults();
      globalSearch.value = '';
    });
    
    resultsContainer.appendChild(resultItem);
  });
  
  searchContainer.style.position = 'relative';
  searchContainer.appendChild(resultsContainer);
}

function hideSearchResults() {
  const existingResults = document.getElementById('search-results');
  if (existingResults) {
    existingResults.remove();
  }
}

function scrollToModel(modelName) {
  const modelsSection = document.getElementById('models');
  const offsetTop = modelsSection.offsetTop - 80;
  window.scrollTo({
    top: offsetTop,
    behavior: 'smooth'
  });
  
  // Highlight the model card briefly
  setTimeout(() => {
    const modelCards = document.querySelectorAll('.model-card');
    modelCards.forEach(card => {
      const nameElement = card.querySelector('.model-name');
      if (nameElement && nameElement.textContent === modelName) {
        card.style.transform = 'scale(1.02)';
        card.style.boxShadow = '0 8px 25px rgba(33, 128, 141, 0.3)';
        setTimeout(() => {
          card.style.transform = '';
          card.style.boxShadow = '';
        }, 2000);
      }
    });
  }, 1000);
}

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  const offsetTop = section.offsetTop - 80;
  window.scrollTo({
    top: offsetTop,
    behavior: 'smooth'
  });
}

// Models Rendering and Filtering
function renderModels(filteredModels = null) {
  const models = filteredModels || appData.llmModels;
  
  modelsGrid.innerHTML = '';
  
  if (models.length === 0) {
    modelsGrid.innerHTML = '<div class="no-results">No models found matching your criteria.</div>';
    return;
  }
  
  models.forEach(model => {
    const modelCard = createModelCard(model);
    modelsGrid.appendChild(modelCard);
  });
}

function createModelCard(model) {
  const card = document.createElement('div');
  card.className = 'model-card fade-in';
  
  const accessTypeClass = model.accessType.toLowerCase().replace(/\s+/g, '-').replace('&', '');
  
  card.innerHTML = `
    <div class="model-header">
      <div>
        <h3 class="model-name">${model.name}</h3>
        <div class="model-developer">${model.developer}</div>
      </div>
      <div class="access-badge access-${accessTypeClass}">${model.accessType}</div>
    </div>
    <p class="model-description">${model.description}</p>
    <div class="model-details">
      <div class="detail-row">
        <span class="detail-label">Parameters:</span>
        <span class="detail-value">${model.parameters}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Capabilities:</span>
        <span class="detail-value">${model.capabilities}</span>
      </div>
    </div>
    <a href="${model.apiLink}" target="_blank" class="btn btn--primary btn--full-width">
      View Documentation
    </a>
  `;
  
  return card;
}

function initializeFilters() {
  developerFilter.addEventListener('change', applyFilters);
  accessFilter.addEventListener('change', applyFilters);
  clearFiltersBtn.addEventListener('click', clearFilters);
}

function applyFilters() {
  currentFilters.developer = developerFilter.value;
  currentFilters.accessType = accessFilter.value;
  
  let filteredModels = appData.llmModels;
  
  if (currentFilters.developer) {
    filteredModels = filteredModels.filter(model => 
      model.developer === currentFilters.developer
    );
  }
  
  if (currentFilters.accessType) {
    filteredModels = filteredModels.filter(model => 
      model.accessType === currentFilters.accessType
    );
  }
  
  renderModels(filteredModels);
}

function clearFilters() {
  currentFilters = { developer: '', accessType: '' };
  developerFilter.value = '';
  accessFilter.value = '';
  renderModels();
}

// Tab Functionality
function initializeTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const targetTab = this.getAttribute('data-tab');
      
      // Remove active class from all buttons and panes
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabPanes.forEach(pane => pane.classList.remove('active'));
      
      // Add active class to clicked button and corresponding pane
      this.classList.add('active');
      document.getElementById(targetTab).classList.add('active');
    });
  });
}

// Scroll Animations
function addScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
      }
    });
  }, observerOptions);
  
  // Observe elements that should animate on scroll
  const animatedElements = document.querySelectorAll('.roadmap-card, .resource-card, .api-guide-card');
  animatedElements.forEach(el => observer.observe(el));
}

// Hero Section Actions
document.addEventListener('DOMContentLoaded', function() {
  const startLearningBtn = document.querySelector('.hero-actions .btn--primary');
  const exploreModelsBtn = document.querySelector('.hero-actions .btn--outline');
  
  if (startLearningBtn) {
    startLearningBtn.addEventListener('click', function(e) {
      e.preventDefault();
      scrollToSection('roadmap');
    });
  }
  
  if (exploreModelsBtn) {
    exploreModelsBtn.addEventListener('click', function(e) {
      e.preventDefault();
      scrollToSection('models');
    });
  }
});

// Roadmap Card Interactions
document.addEventListener('DOMContentLoaded', function() {
  const roadmapCards = document.querySelectorAll('.roadmap-card');
  
  roadmapCards.forEach(card => {
    card.addEventListener('click', function() {
      const level = this.getAttribute('data-level');
      
      // Add a subtle feedback animation
      this.style.transform = 'scale(0.98)';
      setTimeout(() => {
        this.style.transform = '';
      }, 150);
      
      // Could expand to show more details or navigate to specific resources
      console.log(`Selected learning path: ${level}`);
    });
  });
});

// Smooth navbar background on scroll
window.addEventListener('scroll', function() {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.style.background = 'rgba(var(--color-surface), 0.98)';
    navbar.style.backdropFilter = 'blur(15px)';
  } else {
    navbar.style.background = 'rgba(var(--color-surface), 0.95)';
    navbar.style.backdropFilter = 'blur(10px)';
  }
});

// Add loading states for dynamic content
function showLoading(container) {
  container.innerHTML = '<div class="loading">Loading...</div>';
}

// Enhanced keyboard navigation
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    hideSearchResults();
    globalSearch.blur();
  }
  
  if (e.key === '/' && !globalSearch.matches(':focus')) {
    e.preventDefault();
    globalSearch.focus();
  }
});

// Add performance optimization for scroll events
let ticking = false;

function updateOnScroll() {
  updateActiveNavLink();
  ticking = false;
}

window.addEventListener('scroll', function() {
  if (!ticking) {
    requestAnimationFrame(updateOnScroll);
    ticking = true;
  }
});

// Error handling for external links
document.addEventListener('click', function(e) {
  if (e.target.matches('a[target="_blank"]')) {
    try {
      // Optional: Add analytics tracking here
      console.log('External link clicked:', e.target.href);
    } catch (error) {
      console.warn('Error tracking external link:', error);
    }
  }
});

// Initialize tooltips for interactive elements
function initializeTooltips() {
  const tooltipElements = document.querySelectorAll('[data-tooltip]');
  
  tooltipElements.forEach(element => {
    element.addEventListener('mouseenter', function() {
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.textContent = this.getAttribute('data-tooltip');
      document.body.appendChild(tooltip);
      
      const rect = this.getBoundingClientRect();
      tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
      tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
    });
    
    element.addEventListener('mouseleave', function() {
      const tooltip = document.querySelector('.tooltip');
      if (tooltip) {
        tooltip.remove();
      }
    });
  });
}

// Add resize handler for responsive adjustments
window.addEventListener('resize', function() {
  hideSearchResults();
});

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeTooltips();
});

// Console welcome message
console.log('%c🤖 AI Learning Hub', 'font-size: 24px; color: #218c8d; font-weight: bold;');
console.log('%cWelcome to the AI Learning Hub! Start your journey into artificial intelligence.', 'font-size: 14px; color: #626c71;');