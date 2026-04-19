(function() {
    'use strict';

    const ADMIN_CREDENTIALS = {
        username: 'admin',
        password: 'Waleed@2026!'
    };

    const BASE_PAGE_FILES = [
        { label: 'Home', path: '/index.html' },
        { label: 'About', path: '/about/index.html' },
        { label: 'Services', path: '/services/index.html' },
        { label: 'Projects', path: '/projects/index.html' },
        { label: 'Contact', path: '/contact/index.html' },
        { label: 'Blog', path: '/blog/index.html' }
    ];

    const QUICK_CONTENT = [
        {
            id: 'home-hero-title',
            page: 'Home',
            label: 'Home hero title',
            selector: '.hero-title',
            fallback: 'Scale Your Business with Custom AI & Data Solutions.'
        },
        {
            id: 'home-hero-subtitle',
            page: 'Home',
            label: 'Home hero subtitle',
            selector: '.hero-subtitle',
            fallback: 'I build intelligent AI agents, automated workflows, and dynamic data dashboards that eliminate busywork and turn your data into actionable ROI.'
        },
        {
            id: 'about-intro',
            page: 'About',
            label: 'About intro',
            selector: '.about-intro, .section-subtitle',
            fallback: 'I build practical data and AI solutions that deliver measurable business impact.'
        },
        {
            id: 'services-subtitle',
            page: 'Services',
            label: 'Services subtitle',
            selector: '.section-subtitle',
            fallback: 'Hire a Data Scientist and AI Engineer for Machine Learning, Power BI, AI Chatbots, AI Agents, and ETL services'
        },
        {
            id: 'contact-subtitle',
            page: 'Contact',
            label: 'Contact subtitle',
            selector: '.section-subtitle',
            fallback: 'Hire a Data Scientist or AI Engineer for Machine Learning solutions, AI Chatbots, Power BI dashboards, and ETL delivery.'
        },
        {
            id: 'footer-note',
            page: 'Global',
            label: 'Footer note',
            selector: '.footer-note',
            fallback: 'Built with semantic HTML5, CSS3, and vanilla JavaScript. No frameworks, maximum performance.'
        }
    ];

    const PAGE_EDITABLE_SELECTORS = [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'li', 'span', 'cite', 'small',
        '.section-subtitle', '.hero-title', '.hero-subtitle', '.hero-description',
        '.cta-title', '.cta-text', '.footer-text', '.footer-note',
        '.project-title', '.project-summary', '.project-card-title', '.project-cta',
        '.timeline-title', '.timeline-company', '.timeline-location', '.timeline-date',
        '.form-helper', '.text-muted', '.meta-label', '.meta-value',
        '.admin-editable-inline'
    ].join(', ');

    const IMAGE_EDITABLE_SELECTOR = 'img';

    const DRAGGABLE_SELECTORS = [
        '.project-card', '.timeline-item', '.card', '.service-card', '.feature-card',
        '.result-card', '.tech-card', '.lesson-card', '.insight-card', '.metric-card',
        '.testimonial-card', '.footer-col'
    ].join(', ');

    const STORAGE_KEYS = {
        session: 'portfolio-admin-session',
        projects: 'portfolio-admin-projects-draft',
        content: 'portfolio-admin-content-draft'
    };

    const state = {
        activeTab: 'page-editor',
        currentPage: BASE_PAGE_FILES[0],
        editMode: false,
        workspace: null,
        projects: [],
        selectedProjectId: null,
        draggedProjectIndex: null,
        pageDraftHtml: null,
        quickContent: new Map()
        ,pendingPreviewImage: null
        ,pendingProjectImageFile: null
    };

    const els = {};

    document.addEventListener('DOMContentLoaded', init);

    async function init() {
        cacheElements();
        bindLogin();
        bindTabs();
        bindToolbar();
        bindProjectForm();
        bindQuickContent();
        bindExport();
        bindWorkspace();
        bindPreview();

        if (sessionStorage.getItem(STORAGE_KEYS.session) === 'true') {
            enterAdminApp();
        }
    }

    function cacheElements() {
        els.loginView = document.getElementById('login-view');
        els.adminApp = document.getElementById('admin-app');
        els.loginForm = document.getElementById('login-form');
        els.loginError = document.getElementById('login-error');
        els.logoutBtn = document.getElementById('logout-btn');
        els.workspaceStatus = document.getElementById('workspace-status');
        els.connectWorkspaceBtn = document.getElementById('connect-workspace-btn');
        els.savePageBtn = document.getElementById('save-page-btn');
        els.saveProjectsBtn = document.getElementById('save-projects-btn');
        els.exportBtn = document.getElementById('export-btn');
        els.toggleEditBtn = document.getElementById('toggle-edit-btn');
        els.reloadPageBtn = document.getElementById('reload-page-btn');
        els.pageList = document.getElementById('page-list');
        els.previewFrame = document.getElementById('preview-frame');
        els.projectList = document.getElementById('project-list');
        els.projectForm = document.getElementById('project-form');
        els.projectFormTitle = document.getElementById('project-form-title');
        els.addProjectBtn = document.getElementById('add-project-btn');
        els.deleteProjectBtn = document.getElementById('delete-project-btn');
        els.quickContentList = document.getElementById('quick-content-list');
        els.projectImageInput = document.getElementById('project-image');
        els.projectImageFile = document.getElementById('project-image-file');
        els.projectImagePreview = document.getElementById('project-image-preview-img');
        els.globalImagePicker = document.getElementById('global-image-picker');
        els.pageImageList = document.getElementById('page-image-list');
        els.pageEditorPanel = document.getElementById('page-editor-panel');
        els.projectManagerPanel = document.getElementById('project-manager-panel');
        els.pageContentPanel = document.getElementById('page-content-panel');
        els.publishPanel = document.getElementById('publish-panel');
    }

    function bindLogin() {
        els.loginForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();

            if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
                sessionStorage.setItem(STORAGE_KEYS.session, 'true');
                els.loginError.hidden = true;
                enterAdminApp();
            } else {
                els.loginError.hidden = false;
            }
        });

        els.logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem(STORAGE_KEYS.session);
            location.reload();
        });
    }

    function bindTabs() {
        document.querySelectorAll('.admin-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                setActiveTab(tab.getAttribute('data-tab'));
            });
        });
    }

    function bindToolbar() {
        els.toggleEditBtn.addEventListener('click', toggleEditMode);
        els.reloadPageBtn.addEventListener('click', loadCurrentPage);
        els.savePageBtn.addEventListener('click', saveCurrentPage);
        els.saveProjectsBtn.addEventListener('click', saveProjectsToWorkspace);
        els.addProjectBtn.addEventListener('click', () => createProjectDraft());

        els.projectImageInput.addEventListener('input', updateProjectImagePreviewFromPath);
        els.projectImageFile.addEventListener('change', handleProjectImageFileChange);
        els.globalImagePicker.addEventListener('change', handleGlobalImageFileChange);
    }

    function bindWorkspace() {
        els.connectWorkspaceBtn.addEventListener('click', async () => {
            if (!window.showDirectoryPicker) {
                alert('This browser does not support direct workspace editing. You can still export files.');
                return;
            }

            try {
                state.workspace = await window.showDirectoryPicker({ mode: 'readwrite' });
                updateWorkspaceStatus('Workspace connected');
                await loadProjects();
                await loadCurrentPage();
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error(error);
                    updateWorkspaceStatus('Workspace connection failed');
                }
            }
        });
    }

    function bindPreview() {
        els.previewFrame.addEventListener('load', () => {
            if (state.editMode) {
                enablePreviewEditing();
            }
        });
    }

    function bindProjectForm() {
        els.projectForm.addEventListener('submit', event => {
            event.preventDefault();
            upsertProjectFromForm();
        });

        els.deleteProjectBtn.addEventListener('click', () => {
            if (!state.selectedProjectId) return;
            const confirmDelete = confirm('Delete this project?');
            if (!confirmDelete) return;

            state.projects = state.projects.filter(project => project.id !== state.selectedProjectId);
            sessionStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(state.projects));
            renderProjectList();
            createProjectDraft();
        });
    }

    function bindQuickContent() {
        renderQuickContent();
    }

    function bindExport() {
        els.exportBtn.addEventListener('click', async () => {
            await exportProjectFiles();
        });
    }

    function enterAdminApp() {
        els.loginView.hidden = true;
        els.adminApp.hidden = false;
        setActiveTab(state.activeTab);
        renderPageList();
        loadProjects();
        loadCurrentPage();
        renderProjectList();
        updateWorkspaceStatus('Workspace not connected');
    }

    function setActiveTab(tabName) {
        state.activeTab = tabName;

        document.querySelectorAll('.admin-tab').forEach(tab => {
            tab.classList.toggle('active', tab.getAttribute('data-tab') === tabName);
        });

        els.pageEditorPanel.classList.toggle('active', tabName === 'page-editor');
        els.projectManagerPanel.classList.toggle('active', tabName === 'project-manager');
        els.pageContentPanel.classList.toggle('active', tabName === 'page-content');
        els.publishPanel.classList.toggle('active', tabName === 'publish');
    }

    function renderPageList() {
        els.pageList.innerHTML = '';

        const projectPages = state.projects.map(project => ({
            label: `${project.title} Page`,
            path: `/projects/${project.slug}.html`
        }));

        const pages = [...BASE_PAGE_FILES, ...projectPages];

        pages.forEach(page => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'admin-page-button';
            button.textContent = page.label;
            button.title = page.path;
            button.addEventListener('click', () => {
                state.currentPage = page;
                state.editMode = false;
                els.toggleEditBtn.textContent = 'Enable Edit Mode';
                renderPageList();
                loadCurrentPage();
            });
            if (page.path === state.currentPage.path) {
                button.classList.add('active');
            }
            els.pageList.appendChild(button);
        });
    }

    async function loadCurrentPage() {
        const html = await readTextFile(state.currentPage.path);
        if (!html) return;

        const content = state.pageDraftHtml && state.currentPage.path === state.pageDraftHtml.path
            ? state.pageDraftHtml.html
            : html;

        els.previewFrame.srcdoc = content;
        els.previewFrame.addEventListener('load', renderPageImages, { once: true });
    }

    async function toggleEditMode() {
        state.editMode = !state.editMode;
        els.toggleEditBtn.textContent = state.editMode ? 'Disable Edit Mode' : 'Enable Edit Mode';

        if (state.editMode) {
            enablePreviewEditing();
        } else {
            disablePreviewEditing();
        }
    }

    function enablePreviewEditing() {
        const doc = els.previewFrame.contentDocument;
        if (!doc) return;

        doc.body.addEventListener('click', preventNavigation, true);
        doc.querySelectorAll(PAGE_EDITABLE_SELECTORS).forEach(el => {
            if (shouldSkipEditable(el)) return;
            el.setAttribute('contenteditable', 'true');
            el.setAttribute('data-admin-editable', 'true');
            el.classList.add('admin-editable-inline');
        });

        doc.querySelectorAll(DRAGGABLE_SELECTORS).forEach(el => {
            if (el.closest('nav') || el.closest('header')) return;
            el.setAttribute('draggable', 'true');
            el.setAttribute('data-admin-draggable', 'true');
            el.classList.add('admin-draggable');
            wireDragHandlers(el);
        });

        doc.querySelectorAll(IMAGE_EDITABLE_SELECTOR).forEach(img => {
            if (img.closest('svg') || img.closest('button')) return;
            img.setAttribute('data-admin-image', 'true');
            img.classList.add('admin-image-editable');
            img.style.cursor = 'pointer';
            img.onclick = handlePreviewImageClick;
        });
    }

    function disablePreviewEditing() {
        const doc = els.previewFrame.contentDocument;
        if (!doc) return;

        doc.body.removeEventListener('click', preventNavigation, true);
        doc.querySelectorAll('[data-admin-editable]').forEach(el => {
            el.removeAttribute('contenteditable');
            el.removeAttribute('data-admin-editable');
            el.classList.remove('admin-editable-inline');
        });
        doc.querySelectorAll('[data-admin-draggable]').forEach(el => {
            el.removeAttribute('draggable');
            el.removeAttribute('data-admin-draggable');
            el.classList.remove('admin-draggable');
        });

        doc.querySelectorAll('[data-admin-image]').forEach(el => {
            el.removeAttribute('data-admin-image');
            el.classList.remove('admin-image-editable');
            el.style.cursor = '';
            el.onclick = null;
        });
    }

    function shouldSkipEditable(el) {
        return el.closest('script, style, nav, footer .footer-social, .footer-links, .admin-login-view');
    }

    function handlePreviewImageClick(event) {
        if (!state.editMode) return;
        event.preventDefault();
        event.stopPropagation();

        const image = event.currentTarget;
        const currentSrc = image.getAttribute('src') || '';
        const action = prompt('Enter a new image URL/path, or type upload to choose a file.', currentSrc);

        if (action === null) return;

        if (action.trim().toLowerCase() === 'upload') {
            state.pendingPreviewImage = image;
            els.globalImagePicker.value = '';
            els.globalImagePicker.click();
            return;
        }

        const nextSrc = action.trim();
        if (nextSrc) {
            image.setAttribute('src', nextSrc);
        }
    }

    function renderPageImages() {
        if (!els.pageImageList) return;

        const doc = els.previewFrame.contentDocument;
        if (!doc) return;

        const images = Array.from(doc.querySelectorAll('img')).filter(img => !img.closest('svg'));
        els.pageImageList.innerHTML = '';

        if (images.length === 0) {
            els.pageImageList.innerHTML = '<p class="text-muted">No images found on this page.</p>';
            return;
        }

        images.forEach((img, index) => {
            const card = document.createElement('div');
            card.className = 'page-image-card';

            const thumb = document.createElement('img');
            thumb.className = 'page-image-thumb';
            thumb.src = img.getAttribute('src') || '';
            thumb.alt = img.getAttribute('alt') || `Image ${index + 1}`;

            const meta = document.createElement('div');
            meta.className = 'page-image-meta';

            const label = document.createElement('div');
            label.className = 'page-image-label';
            label.textContent = img.getAttribute('alt') || `Image ${index + 1}`;

            const path = document.createElement('div');
            path.className = 'page-image-path';
            path.textContent = img.getAttribute('src') || '';

            const actions = document.createElement('div');
            actions.className = 'page-image-actions';

            const editUrlBtn = document.createElement('button');
            editUrlBtn.type = 'button';
            editUrlBtn.className = 'btn btn-secondary btn-sm';
            editUrlBtn.textContent = 'Change URL';
            editUrlBtn.addEventListener('click', () => {
                const nextSrc = prompt('Enter the new image URL or path:', img.getAttribute('src') || '');
                if (nextSrc === null) return;
                img.setAttribute('src', nextSrc.trim());
                thumb.src = nextSrc.trim();
                path.textContent = nextSrc.trim();
            });

            const uploadBtn = document.createElement('button');
            uploadBtn.type = 'button';
            uploadBtn.className = 'btn btn-primary btn-sm';
            uploadBtn.textContent = 'Upload File';
            uploadBtn.addEventListener('click', () => {
                state.pendingPreviewImage = img;
                els.globalImagePicker.value = '';
                els.globalImagePicker.click();
            });

            actions.append(editUrlBtn, uploadBtn);
            meta.append(label, path, actions);
            card.append(thumb, meta);
            els.pageImageList.appendChild(card);
        });
    }

    function preventNavigation(event) {
        const link = event.target.closest('a');
        if (link) {
            event.preventDefault();
        }
    }

    function wireDragHandlers(element) {
        element.addEventListener('dragstart', event => {
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('text/plain', 'drag');
            element.classList.add('dragging');
        });

        element.addEventListener('dragend', () => {
            element.classList.remove('dragging');
        });

        element.addEventListener('dragover', event => {
            event.preventDefault();
            element.classList.add('admin-dropping');
        });

        element.addEventListener('dragleave', () => {
            element.classList.remove('admin-dropping');
        });

        element.addEventListener('drop', event => {
            event.preventDefault();
            element.classList.remove('admin-dropping');

            const dragged = els.previewFrame.contentDocument.querySelector('.dragging');
            if (!dragged || dragged === element || dragged.parentElement !== element.parentElement) {
                return;
            }

            const parent = element.parentElement;
            const children = Array.from(parent.children);
            const draggedIndex = children.indexOf(dragged);
            const targetIndex = children.indexOf(element);

            if (draggedIndex < targetIndex) {
                parent.insertBefore(dragged, element.nextSibling);
            } else {
                parent.insertBefore(dragged, element);
            }
        });
    }

    async function saveCurrentPage() {
        const doc = els.previewFrame.contentDocument;
        if (!doc) return;

        const clone = doc.documentElement.cloneNode(true);
        clone.querySelectorAll('[data-admin-editable]').forEach(el => {
            el.removeAttribute('contenteditable');
            el.removeAttribute('data-admin-editable');
            el.classList.remove('admin-editable-inline');
        });
        clone.querySelectorAll('[data-admin-draggable]').forEach(el => {
            el.removeAttribute('draggable');
            el.removeAttribute('data-admin-draggable');
            el.classList.remove('admin-draggable');
        });

        const html = '<!DOCTYPE html>\n' + clone.outerHTML;
        state.pageDraftHtml = { path: state.currentPage.path, html };

        const saved = await writeTextFile(state.currentPage.path, html);
        if (!saved) {
            downloadTextFile(getFileName(state.currentPage.path), html, 'text/html');
        }
    }

    async function loadProjects() {
        const raw = await readTextFile('/assets/data/projects.json');
        if (!raw) return;

        let data = JSON.parse(raw).projects || [];
        const draft = sessionStorage.getItem(STORAGE_KEYS.projects);
        if (draft) {
            try {
                data = JSON.parse(draft);
            } catch (error) {
                console.error(error);
            }
        }

        state.projects = data;
        renderProjectList();
        renderQuickContent();
    }

    function renderProjectList() {
        if (!els.projectList) return;

        els.projectList.innerHTML = '';
        state.projects.forEach((project, index) => {
            const template = document.getElementById('project-item-template');
            const item = template.content.firstElementChild.cloneNode(true);
            item.dataset.index = String(index);
            item.dataset.projectId = project.id;
            item.querySelector('.project-list-title').textContent = project.title;
            item.querySelector('.project-list-slug').textContent = project.slug;
            item.addEventListener('click', () => selectProject(project.id));
            item.addEventListener('dragstart', () => {
                state.draggedProjectIndex = index;
                item.classList.add('dragging');
            });
            item.addEventListener('dragend', () => {
                item.classList.remove('dragging');
            });
            item.addEventListener('dragover', event => {
                event.preventDefault();
            });
            item.addEventListener('drop', event => {
                event.preventDefault();
                const fromIndex = state.draggedProjectIndex;
                const toIndex = index;
                if (fromIndex === null || fromIndex === toIndex) return;
                const moved = state.projects.splice(fromIndex, 1)[0];
                state.projects.splice(toIndex, 0, moved);
                sessionStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(state.projects));
                renderProjectList();
            });
            els.projectList.appendChild(item);
        });
    }

    function selectProject(projectId) {
        const project = state.projects.find(item => item.id === projectId);
        if (!project) return;

        state.selectedProjectId = projectId;
        els.projectFormTitle.textContent = `Edit Project: ${project.title}`;
        document.getElementById('project-id').value = project.id;
        document.getElementById('project-title').value = project.title || '';
        document.getElementById('project-slug').value = project.slug || '';
        document.getElementById('project-role').value = project.role || '';
        document.getElementById('project-date').value = project.date || '';
        document.getElementById('project-summary').value = project.summary || '';
        document.getElementById('project-tags').value = (project.tags || []).join(', ');
        document.getElementById('project-image').value = project.image || '';
        updateProjectImagePreview(project.image || '/assets/img/projects/placeholder.png');
        document.getElementById('project-repo').value = project.repo || '';
        document.getElementById('project-demo').value = project.demo || '';
        document.getElementById('project-featured').checked = Boolean(project.featured);
        document.getElementById('project-create-page').checked = true;
    }

    function createProjectDraft() {
        state.selectedProjectId = null;
        els.projectFormTitle.textContent = 'Add New Project';
        document.getElementById('project-id').value = '';
        document.getElementById('project-title').value = '';
        document.getElementById('project-slug').value = '';
        document.getElementById('project-role').value = '';
        document.getElementById('project-date').value = '';
        document.getElementById('project-summary').value = '';
        document.getElementById('project-tags').value = '';
        document.getElementById('project-image').value = '/assets/img/projects/your-project-image.png';
        updateProjectImagePreview('/assets/img/projects/your-project-image.png');
        document.getElementById('project-repo').value = '';
        document.getElementById('project-demo').value = '';
        document.getElementById('project-featured').checked = true;
        document.getElementById('project-create-page').checked = true;
        state.activeTab = 'project-manager';
        setActiveTab('project-manager');
    }

    function upsertProjectFromForm() {
        const projectId = document.getElementById('project-id').value.trim() || generateSlug(document.getElementById('project-title').value.trim());
        const slug = document.getElementById('project-slug').value.trim() || projectId;
        const project = {
            id: projectId,
            title: document.getElementById('project-title').value.trim(),
            slug,
            role: document.getElementById('project-role').value.trim(),
            date: document.getElementById('project-date').value.trim(),
            summary: document.getElementById('project-summary').value.trim(),
            tags: document.getElementById('project-tags').value.split(',').map(tag => tag.trim()).filter(Boolean),
            image: document.getElementById('project-image').value.trim(),
            repo: document.getElementById('project-repo').value.trim() || null,
            demo: document.getElementById('project-demo').value.trim() || null,
            featured: document.getElementById('project-featured').checked
        };

        const existingIndex = state.projects.findIndex(item => item.id === state.selectedProjectId || item.slug === project.slug);
        if (existingIndex >= 0) {
            state.projects[existingIndex] = project;
        } else {
            state.projects.unshift(project);
        }

        sessionStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(state.projects));
        state.selectedProjectId = project.id;
        renderProjectList();
        updateProjectPages(project);
        alert('Project saved in the admin draft. Use Save Projects to write it to the workspace.');
    }

    async function saveProjectsToWorkspace() {
        await persistPendingProjectImage();
        const payload = JSON.stringify({ projects: state.projects }, null, 2);
        const saved = await writeTextFile('/assets/data/projects.json', payload);
        if (!saved) {
            downloadTextFile('projects.json', payload, 'application/json');
        }

        for (const project of state.projects) {
            await updateProjectPages(project);
        }

        updateWorkspaceStatus(saved ? 'Projects saved to workspace' : 'Projects exported as download');
    }

    async function updateProjectPages(project) {
        const homePath = '/index.html';
        const projectsPath = '/projects/index.html';
        const detailPath = `/projects/${project.slug}.html`;

        const cardHtml = buildProjectCard(project);
        await injectProjectCardIntoPage(homePath, project.slug, cardHtml);
        await injectProjectCardIntoPage(projectsPath, project.slug, cardHtml);

        if (document.getElementById('project-create-page').checked) {
            const detailHtml = buildProjectDetailPage(project);
            const saved = await writeTextFile(detailPath, detailHtml);
            if (!saved) {
                downloadTextFile(`${project.slug}.html`, detailHtml, 'text/html');
            }
        }
    }

    async function persistPendingProjectImage() {
        if (!state.pendingProjectImageFile) return;

        const projectTitle = document.getElementById('project-title').value.trim();
        const projectSlug = document.getElementById('project-slug').value.trim() || generateSlug(projectTitle || 'project');
        const file = state.pendingProjectImageFile;
        const safeName = `${projectSlug}-${file.name.replace(/[^a-zA-Z0-9._-]+/g, '-')}`;
        const path = `/assets/img/projects/${safeName}`;

        const saved = await writeBinaryFile(path, file);
        if (saved) {
            document.getElementById('project-image').value = path;
            updateProjectImagePreview(path);
        }

        state.pendingProjectImageFile = null;
        els.projectImageFile.value = '';
    }

    function updateProjectImagePreviewFromPath() {
        updateProjectImagePreview(els.projectImageInput.value.trim() || '/assets/img/projects/placeholder.png');
    }

    function updateProjectImagePreview(src) {
        if (els.projectImagePreview) {
            els.projectImagePreview.src = src || '/assets/img/projects/placeholder.png';
        }
    }

    async function handleProjectImageFileChange(event) {
        const file = event.target.files && event.target.files[0];
        if (!file) return;

        state.pendingProjectImageFile = file;
        const dataUrl = await readFileAsDataUrl(file);
        updateProjectImagePreview(dataUrl);
        if (!state.workspace) {
            document.getElementById('project-image').value = dataUrl;
        }

        if (state.workspace) {
            await persistPendingProjectImage();
        }
    }

    async function handleGlobalImageFileChange(event) {
        const file = event.target.files && event.target.files[0];
        if (!file || !state.pendingPreviewImage) return;

        const targetImage = state.pendingPreviewImage;
        const editorPath = `/assets/img/admin-uploads/${generateSlug(file.name)}`;
        const saved = await writeBinaryFile(editorPath, file);

        if (saved) {
            targetImage.setAttribute('src', editorPath);
        } else {
            targetImage.setAttribute('src', await readFileAsDataUrl(file));
        }

        renderPageImages();

        state.pendingPreviewImage = null;
        event.target.value = '';
    }

    async function injectProjectCardIntoPage(path, slug, cardHtml) {
        const html = await readTextFile(path);
        if (!html) return;

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const grid = doc.querySelector('.projects-grid');
        if (!grid) return;

        const existingCard = grid.querySelector(`.project-card a[href="/projects/${slug}.html"]`)?.closest('.project-card');
        if (existingCard) {
            existingCard.outerHTML = cardHtml;
        } else {
            grid.insertAdjacentHTML('beforeend', cardHtml);
        }

        const updatedHtml = '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;
        const saved = await writeTextFile(path, updatedHtml);
        if (!saved) {
            downloadTextFile(getFileName(path), updatedHtml, 'text/html');
        }
    }

    function buildProjectCard(project) {
        const tags = (project.tags || []).map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('');
        const ctaText = project.cta || 'View Case Study →';
        return `
<article class="project-card" data-tags="${escapeHtml((project.tags || []).join(',').toLowerCase())}">
    <a href="/projects/${escapeHtml(project.slug)}.html" class="project-link">
        <div class="project-header">
            <h2 class="project-card-title">${escapeHtml(project.title)}</h2>
        </div>
        <div class="project-image">
            <img src="${escapeHtml(project.image || '/assets/img/projects/placeholder.png')}" alt="${escapeHtml(project.title)}" loading="lazy" width="1200" height="800">
        </div>
        <div class="project-content">
            <h3 class="project-title">${escapeHtml(project.title)}</h3>
            <p class="project-summary">${escapeHtml(project.summary || '')}</p>
            <div class="project-tags">${tags}</div>
            <span class="project-cta">${escapeHtml(ctaText)}</span>
        </div>
    </a>
</article>`.trim();
    }

    function buildProjectDetailPage(project) {
        const tagList = (project.tags || []).map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('');
        const repoButton = project.repo ? `<a href="${escapeHtml(project.repo)}" class="btn btn-secondary" target="_blank" rel="noopener noreferrer">GitHub Repo</a>` : '';
        const demoButton = project.demo ? `<a href="${escapeHtml(project.demo)}" class="btn btn-primary" target="_blank" rel="noopener noreferrer">Live Demo</a>` : '';
        const contactBlock = project.cta ? `
        <section class="project-section">
            <div class="container content-container">
                <div class="card" style="text-align:center;">
                    <h2 class="section-title">Need a workflow like this?</h2>
                    <p class="lead">If you need this project or need this type of service, get in touch.</p>
                    <a href="/contact/" class="btn btn-primary">${escapeHtml(project.cta)}</a>
                </div>
            </div>
        </section>` : '';

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${escapeHtml(project.summary || project.title)}">
    <meta name="robots" content="noindex, nofollow">
    <title>${escapeHtml(project.title)} - Waleed Hassan</title>
    <link rel="canonical" href="https://dswaleed.live/projects/${escapeHtml(project.slug)}.html">
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <link rel="stylesheet" href="/assets/css/base.css?v=6">
    <link rel="stylesheet" href="/assets/css/components.css?v=6">
    <link rel="stylesheet" href="/assets/css/modern-enhancements.css?v=6">
</head>
<body>
    <a href="#main" class="skip-link">Skip to main content</a>
    <nav class="nav" role="navigation">
        <div class="container nav-container">
            <a href="/" class="logo"><span class="logo-text">Waleed Hassan</span></a>
            <button class="nav-toggle" aria-label="Toggle navigation menu" aria-expanded="false"><span class="hamburger"></span></button>
            <ul class="nav-menu" id="nav-menu">
                <li><a href="/" class="nav-link">Home</a></li>
                <li><a href="/projects/" class="nav-link active" aria-current="page">Projects</a></li>
                <li><a href="/about/" class="nav-link">About</a></li>
                <li><a href="/services/" class="nav-link">Services</a></li>
                <li><a href="/contact/" class="nav-link nav-link-cta">Contact</a></li>
            </ul>
        </div>
    </nav>

    <main id="main">
        <section class="project-hero fade-in">
            <div class="container">
                <p class="project-hero-subtitle">${escapeHtml(project.role || 'Portfolio Project')} · ${escapeHtml(project.date || '')}</p>
                <h1 class="project-hero-title">${escapeHtml(project.title)}</h1>
                <p class="lead">${escapeHtml(project.summary || '')}</p>
                <div class="project-tags">${tagList}</div>
                <div class="project-links">${demoButton}${repoButton}</div>
            </div>
        </section>

        <section class="project-section">
            <div class="container content-container">
                <h2 class="section-title">Overview</h2>
                <div class="card">
                    <p class="text-muted">This detail page was generated from the admin panel so you can publish new projects with the same visual style as the rest of the portfolio.</p>
                    <p class="text-muted">You can open this page again in the admin panel to refine the copy, update the image, or add more sections.</p>
                </div>
            </div>
        </section>

        <section class="project-section bg-elevated">
            <div class="container content-container">
                <h2 class="section-title">Project Visual</h2>
                <div class="project-visual">
                    <img src="${escapeHtml(project.image || '/assets/img/projects/placeholder.png')}" alt="${escapeHtml(project.title)}" loading="lazy" width="1400" height="900">
                </div>
            </div>
        </section>
${contactBlock}
    </main>

    <footer class="footer">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-col">
                    <h3 class="footer-heading">Waleed Hassan</h3>
                    <p class="footer-text">Data Scientist & AI Developer specializing in Python-first solutions with measurable business impact.</p>
                    <div class="footer-social">
                        <a href="https://github.com/waleedhassan985" class="social-link" aria-label="GitHub" target="_blank" rel="noopener noreferrer">GitHub</a>
                        <a href="https://www.linkedin.com/in/waleed-hassan-091804279/" class="social-link" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                        <a href="https://www.upwork.com/freelancers/~015f1e851e8e9483d9?mp_source=share" class="social-link" aria-label="Upwork" target="_blank" rel="noopener noreferrer">Upwork</a>
                    </div>
                </div>
                <div class="footer-col">
                    <h4 class="footer-heading">Navigation</h4>
                    <ul class="footer-links">
                        <li><a href="/">Home</a></li>
                        <li><a href="/projects/">Projects</a></li>
                        <li><a href="/about/">About</a></li>
                        <li><a href="/services/">Services</a></li>
                        <li><a href="/contact/">Contact</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4 class="footer-heading">Expertise</h4>
                    <ul class="footer-links">
                        <li>Python & Data Analysis</li>
                        <li>Machine Learning</li>
                        <li>Generative AI</li>
                        <li>Data Visualization</li>
                        <li>BI Dashboards</li>
                        <li>Workflow Automation</li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4 class="footer-heading">Contact</h4>
                    <ul class="footer-links">
                        <li><a href="mailto:info@dswaleed.live">info@dswaleed.live</a></li>
                        <li>Green Avenue Islamabad, Pakistan</li>
                        <li><a href="/assets/Waleed_Resume.pdf" download>Download Resume</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2025 Waleed Hassan. All rights reserved.</p>
                <p class="footer-note">Built with semantic HTML5, CSS3, and vanilla JavaScript. No frameworks, maximum performance.</p>
            </div>
        </div>
    </footer>

    <script src="/assets/js/main.js" defer></script>
    <script src="/assets/js/modern-interactions.js" defer></script>
</body>
</html>`;
    }

    async function exportProjectFiles() {
        const files = [
            { path: '/assets/data/projects.json', content: JSON.stringify({ projects: state.projects }, null, 2), type: 'application/json' }
        ];

        for (const project of state.projects) {
            files.push({
                path: `/projects/${project.slug}.html`,
                content: buildProjectDetailPage(project),
                type: 'text/html'
            });
        }

        for (const file of files) {
            const saved = await writeTextFile(file.path, file.content);
            if (!saved) {
                downloadTextFile(getFileName(file.path), file.content, file.type);
            }
        }

        alert('Export complete. Downloaded files or workspace writes are ready.');
    }

    async function renderQuickContent() {
        els.quickContentList.innerHTML = '';

        for (const item of QUICK_CONTENT) {
            const template = document.getElementById('quick-content-template');
            const card = template.content.firstElementChild.cloneNode(true);
            const currentValue = await getQuickContentValue(item);

            card.querySelector('.quick-content-title').textContent = item.label;
            card.querySelector('.quick-content-page').textContent = item.page;
            const body = card.querySelector('.quick-content-body');
            const input = card.querySelector('.quick-content-input');
            input.value = currentValue;

            card.querySelector('.quick-content-expand').addEventListener('click', () => {
                body.hidden = !body.hidden;
            });

            card.querySelector('.quick-content-save').addEventListener('click', async () => {
                await setQuickContentValue(item, input.value);
                alert('Draft saved. Use page editor or export to push it into the site files.');
            });

            card.querySelector('.quick-content-reset').addEventListener('click', async () => {
                input.value = item.fallback;
                await setQuickContentValue(item, item.fallback);
            });

            els.quickContentList.appendChild(card);
        }
    }

    async function getQuickContentValue(item) {
        if (state.quickContent.has(item.id)) {
            return state.quickContent.get(item.id);
        }

        const drafts = sessionStorage.getItem(STORAGE_KEYS.content);
        if (drafts) {
            try {
                const parsed = JSON.parse(drafts);
                if (parsed[item.id]) {
                    state.quickContent.set(item.id, parsed[item.id]);
                    return parsed[item.id];
                }
            } catch (error) {
                console.error(error);
            }
        }

        state.quickContent.set(item.id, item.fallback);
        return item.fallback;
    }

    async function setQuickContentValue(item, value) {
        state.quickContent.set(item.id, value);
        const drafts = Object.fromEntries(state.quickContent.entries());
        sessionStorage.setItem(STORAGE_KEYS.content, JSON.stringify(drafts));

        if (state.workspace) {
            await writeTextFile('/assets/data/site-content.json', JSON.stringify(drafts, null, 2));
        }
    }

    function updateWorkspaceStatus(text) {
        els.workspaceStatus.textContent = text;
    }

    async function readTextFile(path) {
        if (state.workspace) {
            const handle = await resolveHandle(state.workspace, path);
            if (handle) {
                const file = await handle.getFile();
                return await file.text();
            }
        }

        try {
            const response = await fetch(path);
            if (!response.ok) return '';
            return await response.text();
        } catch (error) {
            console.error(error);
            return '';
        }
    }

    async function writeTextFile(path, content) {
        if (!state.workspace || !window.showDirectoryPicker) {
            return false;
        }

        try {
            const handle = await resolveHandle(state.workspace, path, true);
            const writable = await handle.createWritable();
            await writable.write(content);
            await writable.close();
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    async function writeBinaryFile(path, file) {
        if (!state.workspace || !window.showDirectoryPicker) {
            return false;
        }

        try {
            const handle = await resolveHandle(state.workspace, path, true);
            const writable = await handle.createWritable();
            await writable.write(file);
            await writable.close();
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    function readFileAsDataUrl(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result));
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    async function resolveHandle(root, relativePath, create = false) {
        const parts = relativePath.replace(/^\//, '').split('/');
        let current = root;

        for (let index = 0; index < parts.length - 1; index += 1) {
            current = await current.getDirectoryHandle(parts[index], { create });
        }

        return await current.getFileHandle(parts[parts.length - 1], { create });
    }

    function downloadTextFile(fileName, content, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(url);
    }

    function getFileName(path) {
        return path.split('/').pop();
    }

    function generateSlug(input) {
        return input
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
})();
