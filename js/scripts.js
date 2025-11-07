// 回到顶部按钮功能
window.addEventListener('scroll', function() {
    const backToTopButton = document.getElementById('backToTop');
    if (window.scrollY > 300) {
        backToTopButton.classList.add('show');
    } else {
        backToTopButton.classList.remove('show');
    }
});

document.getElementById('backToTop').addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', function() {
    // 如果是博客页面，则初始化笔记功能
    if (document.getElementById('notes-container')) {
        initNotes();
    }
});

// 模拟文件系统结构 - 基于实际的notes文件夹结构
const fileSystem = {
    name: 'notes',
    type: 'directory',
    children: [
        {
            name: '.assets',
            type: 'directory',
            children: []
        },
        {
            name: 'Elasticsearch',
            type: 'directory',
            children: [
                {
                    name: '0_入门.md',
                    type: 'file',
                    path: 'notes/Elasticsearch/0_入门.md'
                }
            ]
        },
        {
            name: 'JAVA',
            type: 'directory',
            children: [
                {
                    name: '0_入门.md',
                    type: 'file',
                    path: 'notes/JAVA/0_入门.md'
                },
                {
                    name: '1_集合.md',
                    type: 'file',
                    path: 'notes/JAVA/1_集合.md'
                }
            ]
        },
        {
            name: 'JUC',
            type: 'directory',
            children: [
                {
                    name: '0_入门.md',
                    type: 'file',
                    path: 'notes/JUC/0_入门.md'
                }
            ]
        },
        {
            name: 'JVM',
            type: 'directory',
            children: [
                {
                    name: '0_入门.md',
                    type: 'file',
                    path: 'notes/JVM/0_入门.md'
                }
            ]
        },
        {
            name: 'MQ',
            type: 'directory',
            children: [
                {
                    name: '0_入门.md',
                    type: 'file',
                    path: 'notes/MQ/0_入门.md'
                }
            ]
        },
        {
            name: 'MySQL',
            type: 'directory',
            children: [
                {
                    name: '0_入门.md',
                    type: 'file',
                    path: 'notes/MySQL/0_入门.md'
                }
            ]
        },
        {
            name: 'Redis',
            type: 'directory',
            children: [
                {
                    name: '0_入门.md',
                    type: 'file',
                    path: 'notes/Redis/0_入门.md'
                }
            ]
        },
        {
            name: 'SpringBoot',
            type: 'directory',
            children: [
                {
                    name: '0_入门.md',
                    type: 'file',
                    path: 'notes/SpringBoot/0_入门.md'
                }
            ]
        },
        {
            name: 'SpringCloud',
            type: 'directory',
            children: [
                {
                    name: '0_入门.md',
                    type: 'file',
                    path: 'notes/SpringCloud/0_入门.md'
                }
            ]
        }
    ]
};

// 笔记元数据 - 存储笔记的额外信息
const noteMetadata = {
    'notes/Elasticsearch/0_入门.md': {
        title: 'Elasticsearch 搜索引擎',
        date: '2024-01-23',
        description: '全文检索、索引、查询DSL'
    },
    'notes/JAVA/0_入门.md': {
        title: 'Java 入门基础',
        date: '2024-01-15',
        description: 'Java语言概述、环境搭建、基本语法、面向对象编程基础'
    },
    'notes/JAVA/1_集合.md': {
        title: 'Java 集合框架详解',
        date: '2024-01-16',
        description: 'Collection接口、List、Set、Map、迭代方式、性能对比'
    },
    'notes/JUC/0_入门.md': {
        title: 'Java并发编程',
        date: '2024-01-24',
        description: '线程安全、锁机制、并发集合'
    },
    'notes/JVM/0_入门.md': {
        title: 'JVM 内存模型',
        date: '2024-01-17',
        description: 'JVM内存结构、垃圾回收、类加载机制'
    },
    'notes/MQ/0_入门.md': {
        title: '消息队列原理',
        date: '2024-01-22',
        description: '消息队列基本概念、应用场景'
    },
    'notes/MySQL/0_入门.md': {
        title: 'MySQL 索引优化',
        date: '2024-01-18',
        description: '索引原理、查询优化、性能调优'
    },
    'notes/Redis/0_入门.md': {
        title: 'Redis 数据结构',
        date: '2024-01-19',
        description: 'String、List、Hash、Set、Sorted Set等数据结构'
    },
    'notes/SpringBoot/0_入门.md': {
        title: 'Spring Boot 基础',
        date: '2024-01-20',
        description: '自动配置、starters、配置管理'
    },
    'notes/SpringCloud/0_入门.md': {
        title: 'Spring Cloud 微服务',
        date: '2024-01-21',
        description: '服务注册发现、配置中心、网关'
    }
};

// 简化模拟的笔记内容，避免语法错误
const mockNoteContents = {
    'notes/JAVA/0_入门.md': '# Java 入门基础',
    'notes/JAVA/1_集合.md': '# Java 集合框架详解',
    'notes/JVM/0_入门.md': '# JVM 内存模型',
    'notes/MySQL/0_入门.md': '# MySQL 索引优化',
    'notes/Redis/0_入门.md': '# Redis 数据结构',
    'notes/SpringBoot/0_入门.md': '# Spring Boot 基础',
    'notes/SpringCloud/0_入门.md': '# Spring Cloud 微服务',
    'notes/MQ/0_入门.md': '# 消息队列原理',
    'notes/Elasticsearch/0_入门.md': '# Elasticsearch 搜索引擎',
    'notes/JUC/0_入门.md': '# Java并发编程'
};

// 笔记管理类 - 基于文件系统结构实现层级渲染
class NotesManager {
    constructor() {
        this.fileSystem = fileSystem;
        this.currentPath = []; // 当前路径，用于层级导航
        this.searchQuery = '';
        this.expandedFolders = new Set(); // 记录展开的文件夹
        this.init();
    }

    init() {
        // 渲染文件系统结构
        this.renderFileSystem();
        this.setupEventListeners();
    }

    // 递归渲染文件系统结构
    renderFileSystem() {
        const notesContainer = document.getElementById('notes-container');
        
        // 显示加载状态
        notesContainer.innerHTML = '<div class="py-12 text-center"><p class="text-gray-400">正在加载笔记结构...</p></div>';
        
        // 模拟异步加载
        setTimeout(() => {
            notesContainer.innerHTML = '';
            
            // 创建层级导航栏
            const breadcrumb = document.createElement('div');
            breadcrumb.className = 'mb-6 flex items-center space-x-2';
            breadcrumb.innerHTML = `
                <button class="path-item active" data-path="">
                    <i class="fa fa-folder mr-1"></i>笔记根目录
                </button>
            `;
            notesContainer.appendChild(breadcrumb);
            
            // 创建文件系统结构容器
            const fsContainer = document.createElement('div');
            fsContainer.className = 'file-system';
            
            // 递归渲染目录结构
            this.renderDirectory(this.fileSystem, fsContainer, 0);
            
            notesContainer.appendChild(fsContainer);
            
            // 绑定层级导航事件
            this.bindBreadcrumbEvents();
        }, 300);
    }

    // 递归渲染目录和文件
    renderDirectory(directory, parentElement, level) {
        // 跳过隐藏文件夹
        if (directory.name.startsWith('.') && level > 0) return;
        
        // 过滤搜索结果
        if (this.searchQuery) {
            // 只有包含搜索词的文件或文件夹才显示
            const hasMatchingItems = this.hasMatchingItems(directory);
            if (!hasMatchingItems && level > 0) return;
        }
        
        const isRoot = level === 0;
        const indent = level * 20;
        
        // 为非根目录创建目录项
        let directoryElement;
        if (!isRoot) {
            directoryElement = document.createElement('div');
            directoryElement.className = 'directory-item mb-2';
            directoryElement.style.paddingLeft = `${indent}px`;
            
            const isExpanded = this.expandedFolders.has(directory.path || directory.name);
            
            directoryElement.innerHTML = `
                <div class="directory-header flex items-center cursor-pointer">
                    <span class="toggle-icon mr-2 text-gray-400">
                        <i class="fa fa-chevron-${isExpanded ? 'down' : 'right'}"></i>
                    </span>
                    <span class="folder-icon mr-2 text-yellow-500">
                        <i class="fa fa-folder"></i>
                    </span>
                    <span class="directory-name text-yellow-400 font-medium">${directory.name}</span>
                </div>
                <div class="directory-content" style="display: ${isExpanded ? 'block' : 'none'}"></div>
            `;
            
            parentElement.appendChild(directoryElement);
            
            // 绑定展开/折叠事件
            const header = directoryElement.querySelector('.directory-header');
            header.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleDirectory(directory, directoryElement);
            });
            
            parentElement = directoryElement.querySelector('.directory-content');
        }
        
        // 按类型和名称排序：文件夹在前，文件在后，都按名称排序
        const sortedChildren = [...directory.children].sort((a, b) => {
            if (a.type !== b.type) {
                return a.type === 'directory' ? -1 : 1;
            }
            return a.name.localeCompare(b.name);
        });
        
        // 渲染子项目
        sortedChildren.forEach(child => {
            if (child.type === 'directory') {
                // 递归渲染子目录
                this.renderDirectory(child, parentElement, level + 1);
            } else if (child.type === 'file' && child.name.endsWith('.md')) {
                // 渲染Markdown文件
                this.renderFile(child, parentElement, level + 1);
            }
        });
    }

    // 渲染文件项
    renderFile(file, parentElement, level) {
        // 如果有搜索查询，检查文件名是否匹配
        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            const metadata = noteMetadata[file.path];
            
            if (!file.name.toLowerCase().includes(query) && 
                (!metadata || !metadata.title.toLowerCase().includes(query) && 
                !metadata.description.toLowerCase().includes(query))) {
                return;
            }
        }
        
        const indent = level * 20;
        const fileElement = document.createElement('div');
        const metadata = noteMetadata[file.path] || {
            title: this.getFileNameWithoutExtension(file.name),
            date: '未知',
            description: ''
        };
        
        fileElement.className = 'file-item p-3 bg-gray-800/50 rounded-lg mb-2 hover:bg-gray-700/50 transition-colors cursor-pointer';
        fileElement.style.paddingLeft = `${indent}px`;
        fileElement.dataset.path = file.path;
        
        fileElement.innerHTML = `
            <div class="file-icon mr-2 text-blue-400 inline-block">
                <i class="fa fa-file-text-o"></i>
            </div>
            <div class="file-info inline-block">
                <h4 class="file-title text-blue-300 font-medium mb-1">${metadata.title}</h4>
                ${metadata.description ? `<p class="file-description text-sm text-gray-400 mb-1">${metadata.description}</p>` : ''}
                <p class="file-date text-xs text-gray-500">${metadata.date}</p>
            </div>
        `;
        
        parentElement.appendChild(fileElement);
        
        // 绑定点击事件
        fileElement.addEventListener('click', () => {
            this.showNoteDetail(file.path);
        });
    }

    // 切换目录展开/折叠状态
    toggleDirectory(directory, directoryElement) {
        const contentElement = directoryElement.querySelector('.directory-content');
        const toggleIcon = directoryElement.querySelector('.toggle-icon i');
        const folderIcon = directoryElement.querySelector('.folder-icon i');
        
        const isExpanded = contentElement.style.display === 'block';
        
        if (isExpanded) {
            contentElement.style.display = 'none';
            toggleIcon.className = 'fa fa-chevron-right';
            folderIcon.className = 'fa fa-folder';
            this.expandedFolders.delete(directory.path || directory.name);
        } else {
            contentElement.style.display = 'block';
            toggleIcon.className = 'fa fa-chevron-down';
            folderIcon.className = 'fa fa-folder-open';
            this.expandedFolders.add(directory.path || directory.name);
        }
    }

    // 绑定层级导航事件
    bindBreadcrumbEvents() {
        document.querySelectorAll('.path-item').forEach(item => {
            item.addEventListener('click', () => {
                const path = item.dataset.path;
                // 这里可以实现层级导航功能
                console.log('Navigate to:', path);
            });
        });
    }

    // 检查目录是否包含匹配搜索词的项
    hasMatchingItems(directory) {
        const query = this.searchQuery.toLowerCase();
        
        // 检查目录名
        if (directory.name.toLowerCase().includes(query)) {
            return true;
        }
        
        // 递归检查子项
        for (const child of directory.children) {
            if (child.type === 'directory') {
                if (this.hasMatchingItems(child)) {
                    return true;
                }
            } else if (child.type === 'file' && child.name.endsWith('.md')) {
                const metadata = noteMetadata[child.path];
                if (child.name.toLowerCase().includes(query) || 
                    (metadata && (metadata.title.toLowerCase().includes(query) || 
                    metadata.description.toLowerCase().includes(query)))) {
                    return true;
                }
            }
        }
        
        return false;
    }

    // 显示笔记详情
    showNoteDetail(path) {
        const modal = document.getElementById('note-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        
        // 获取笔记元数据
        const metadata = noteMetadata[path] || {
            title: this.getFileNameWithoutExtension(path.split('/').pop())
        };
        
        modalTitle.textContent = metadata.title;
        
        // 显示加载状态
        modalBody.innerHTML = '<div class="py-8 text-center"><p class="text-gray-400">正在加载笔记内容...</p></div>';
        
        // 显示模态框
        modal.classList.add('show');
        modal.style.opacity = '1';
        modal.style.pointerEvents = 'auto';
        document.body.style.overflow = 'hidden';
        
        // 模拟加载内容
        setTimeout(() => {
            // 获取笔记内容并渲染
            const noteContent = mockNoteContents[path] || `# ${metadata.title}\n\n笔记内容加载中...`;
            const renderedContent = this.renderMarkdown(noteContent);
            modalBody.innerHTML = renderedContent;
        }, 300);
    }

    // 简单的Markdown渲染函数
    renderMarkdown(markdown) {
        // 首先转义HTML特殊字符，防止XSS攻击
        let html = markdown
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
        
        // 标题
        html = html.replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-primary mt-6 mb-4">$1</h1>');
        html = html.replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold text-gray-200 mt-5 mb-3">$1</h2>');
        html = html.replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold text-gray-300 mt-4 mb-2">$1</h3>');
        
        // 粗体
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // 斜体
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // 代码块
        html = html.replace(/```(\w*)\n([\s\S]*?)```/g, function(match, lang, code) {
            return '<pre class="bg-gray-800 p-4 rounded-lg overflow-x-auto my-4"><code class="text-sm">' + code + '</code></pre>';
        });
        
        // 行内代码
        html = html.replace(/`(.*?)`/g, '<code class="bg-gray-700 px-1 py-0.5 rounded text-sm">$1</code>');
        
        // 列表项
        html = html.replace(/^- (.*$)/gm, '<li class="list-disc ml-6 mb-1">$1</li>');
        html = html.replace(/^\d\. (.*$)/gm, '<li class="list-decimal ml-6 mb-1">$1</li>');
        
        // 处理列表块
        html = html.replace(/<li>(.*?)<\/li>/gs, '<ul class="my-4">$&</ul>');
        html = html.replace(/<ul><\/ul>/g, '');
        
        // 段落
        html = html.replace(/^(?!<h|<ul|<ol|<pre|<blockquote)(.*$)/gm, '<p class="my-2">$1</p>');
        
        // 水平线
        html = html.replace(/^---$/gm, '<hr class="border-gray-700 my-6">');
        
        // 链接
        html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-primary hover:underline" target="_blank">$1</a>');
        
        return html;
    }

    // 获取不带扩展名的文件名
    getFileNameWithoutExtension(filename) {
        return filename.replace(/\.[^/.]+$/, '');
    }

    // 设置事件监听器
    setupEventListeners() {
        // 搜索功能
        const searchInput = document.getElementById('search-input');
        let searchTimeout;
        
        searchInput.addEventListener('input', (e) => {
            // 清除之前的定时器
            clearTimeout(searchTimeout);
            
            // 设置新的定时器，延迟执行搜索，避免频繁更新
            searchTimeout = setTimeout(() => {
                this.searchQuery = e.target.value.trim();
                this.renderFileSystem();
            }, 300);
        });
        
        // 关闭模态框
        const closeModal = document.getElementById('close-modal');
        closeModal.addEventListener('click', () => {
            const modal = document.getElementById('note-modal');
            modal.classList.remove('show');
            modal.style.opacity = '0';
            modal.style.pointerEvents = 'none';
            document.body.style.overflow = '';
        });
        
        // 点击模态框外部关闭
        document.getElementById('note-modal').addEventListener('click', (e) => {
            if (e.target === document.getElementById('note-modal')) {
                const modal = document.getElementById('note-modal');
                modal.classList.remove('show');
                modal.style.opacity = '0';
                modal.style.pointerEvents = 'none';
                document.body.style.overflow = '';
            }
        });
        
        // 按ESC键关闭模态框
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modal = document.getElementById('note-modal');
                if (modal.classList.contains('show')) {
                    modal.classList.remove('show');
                    modal.style.opacity = '0';
                    modal.style.pointerEvents = 'none';
                    document.body.style.overflow = '';
                }
            }
        });
    }
}

// 初始化笔记功能
function initNotes() {
    new NotesManager();
}