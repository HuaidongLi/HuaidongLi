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

// 扫描notes目录结构的函数
async function scanNotesDirectory(path = 'notes') {
    try {
        // 由于浏览器安全限制，无法直接扫描本地文件系统
        // 这里使用预定义的目录结构，完全匹配实际的notes文件夹结构
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
                    name: 'Elasticrsearch',
                    type: 'directory',
                    children: [
                        {
                            name: '0_入门.md',
                            type: 'file',
                            path: 'notes/Elasticrsearch/0_入门.md'
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
        return fileSystem;
    } catch (error) {
        console.error('扫描目录失败:', error);
        return null;
    }
}

// 从markdown文件中提取元数据的函数
function extractMetadataFromMarkdown(content, filename = '') {
    // 改进的标题提取逻辑，支持各种格式的一级标题
    let title = '';
    
    // 尝试匹配标准的一级标题格式
    const titleMatch1 = content.match(/^#\s+(.*?)$/m);
    if (titleMatch1) {
        title = titleMatch1[1].trim();
    } else {
        // 尝试匹配可能有缩进的一级标题
        const titleMatch2 = content.match(/^\s*#\s+(.*?)$/m);
        if (titleMatch2) {
            title = titleMatch2[1].trim();
        } else if (content.trim()) {
            // 如果没有找到标题，使用文件的第一行作为标题
            const firstLine = content.trim().split('\n')[0];
            title = firstLine.replace(/^[#*\s]+/, '').trim();
        }
    }
    
    // 如果从内容中没有提取到标题，使用文件名作为后备方案
    if (!title && filename) {
        // 获取文件名（不带路径和扩展名）
        const baseName = filename.split('/').pop();
        title = baseName.split('.').slice(0, -1).join('.');
        // 移除可能的数字前缀和下划线（如 "0_入门" -> "入门"）
        title = title.replace(/^\d+_/, '');
        // 解码可能的URL编码字符
        try {
            title = decodeURIComponent(title);
        } catch (e) {
            // 如果解码失败，保持原样
        }
    }
    
    // 尝试从文件内容中提取描述信息（第一个段落）
    const descriptionMatch = content.match(/^#.*?\n\n([^\n#].*?)(?:\n|$)/s);
    let description = descriptionMatch ? descriptionMatch[1].trim().substring(0, 100) : '';
    if (description.length > 97) description += '...';
    
    return {
        title: title || '未命名笔记',
        date: '未知',
        description: description
    };
}

// 缓存已读取的笔记元数据，避免重复读取
const noteMetadataCache = new Map();

// 笔记管理类 - 基于文件系统结构实现层级渲染
class NotesManager {
    constructor() {
        this.fileSystem = null;
        this.currentPath = []; // 当前路径，用于层级导航
        this.searchQuery = '';
        this.expandedFolders = new Set(); // 记录展开的文件夹
        this.init();
    }

    async init() {
        // 渲染文件系统结构
        await this.renderFileSystem();
        this.setupEventListeners();
    }

    // 递归渲染文件系统结构
    async renderFileSystem() {
        const notesContainer = document.getElementById('notes-container');
        
        // 显示加载状态
        notesContainer.innerHTML = '<div class="py-12 text-center"><p class="text-gray-400">正在加载笔记结构...</p></div>';
        
        try {
            // 扫描notes目录结构
            this.fileSystem = await scanNotesDirectory();
            
            if (!this.fileSystem) {
                throw new Error('无法加载笔记结构');
            }
            
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
            await this.renderDirectory(this.fileSystem, fsContainer, 0);
            
            notesContainer.appendChild(fsContainer);
            
            // 绑定层级导航事件
            this.bindBreadcrumbEvents();
        } catch (error) {
            console.error('渲染文件系统失败:', error);
            notesContainer.innerHTML = '<div class="py-12 text-center"><p class="text-red-400">加载笔记失败，请刷新页面重试</p></div>';
        }
    }

    // 递归渲染目录和文件
    async renderDirectory(directory, parentElement, level) {
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
        for (const child of sortedChildren) {
            if (child.type === 'directory') {
                // 递归渲染子目录
                await this.renderDirectory(child, parentElement, level + 1);
            } else if (child.type === 'file' && child.name.endsWith('.md')) {
                // 渲染Markdown文件
                await this.renderFile(child, parentElement, level + 1);
            }
        }
    }

    // 渲染文件项
    async renderFile(file, parentElement, level) {
        try {
            // 获取文件元数据
            let metadata;
            if (noteMetadataCache.has(file.path)) {
                metadata = noteMetadataCache.get(file.path);
            } else {
                // 尝试从文件内容中提取元数据
                try {
                    const response = await fetch(file.path);
                    if (response.ok) {
                        const content = await response.text();
                        metadata = extractMetadataFromMarkdown(content, file.path);
                    } else {
                        // 改进的文件名处理逻辑
                        let fileName = this.getFileNameWithoutExtension(file.name);
                        // 移除可能的数字前缀和下划线
                        fileName = fileName.replace(/^\d+_/, '');
                        metadata = {
                            title: fileName || '未命名笔记',
                            date: '未知',
                            description: ''
                        };
                    }
                } catch (error) {
                    console.warn(`无法读取文件 ${file.path}:`, error);
                    // 改进的文件名处理逻辑
                    let fileName = this.getFileNameWithoutExtension(file.name);
                    // 移除可能的数字前缀和下划线
                    fileName = fileName.replace(/^\d+_/, '');
                    metadata = {
                        title: fileName || '未命名笔记',
                        date: '未知',
                        description: ''
                    };
                }
                noteMetadataCache.set(file.path, metadata);
            }
            
            // 如果有搜索查询，检查文件名是否匹配
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                
                if (!file.name.toLowerCase().includes(query) && 
                    !metadata.title.toLowerCase().includes(query) && 
                    !metadata.description.toLowerCase().includes(query)) {
                    return;
                }
            }
            
            const indent = level * 20;
            const fileElement = document.createElement('div');
            
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
        } catch (error) {
            console.error(`渲染文件项失败 ${file.path}:`, error);
        }
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
    async showNoteDetail(path) {
        console.log('尝试显示笔记详情:', path);
        
        const modal = document.getElementById('note-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        
        // 确保元素都存在
        if (!modal || !modalTitle || !modalBody) {
            console.error('无法找到模态框元素');
            return;
        }
        
        console.log('模态框元素已找到');
        
        // 获取笔记元数据
        let metadata = noteMetadataCache.get(path) || {
            title: this.getFileNameWithoutExtension(path.split('/').pop())
        };
        
        modalTitle.textContent = metadata.title;
        console.log('设置模态框标题:', metadata.title);
        
        // 显示加载状态
        modalBody.innerHTML = '<div class="py-8 text-center"><p class="text-gray-400">正在加载笔记内容...</p></div>';
        
        // 强制设置模态框样式
        modal.style.display = 'flex';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        modal.style.zIndex = '1000';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.style.opacity = '1';
        modal.style.pointerEvents = 'auto';
        document.body.style.overflow = 'hidden';
        
        console.log('模态框样式已设置，准备加载笔记内容');
        
        try {
            // 直接从文件路径获取笔记内容
            const response = await fetch(path);
            
            if (!response.ok) {
                throw new Error(`无法加载文件: ${path}`);
            }
            
            // 读取markdown内容
            const noteContent = await response.text();
            
            // 如果没有元数据，尝试从内容中提取
            if (!noteMetadataCache.has(path)) {
                metadata = extractMetadataFromMarkdown(noteContent, path);
                noteMetadataCache.set(path, metadata);
                modalTitle.textContent = metadata.title;
            }
            
            // 渲染markdown内容
            console.log('渲染笔记内容:', noteContent.substring(0, 100) + '...');
            const renderedContent = this.renderMarkdown(noteContent);
            console.log('渲染后的HTML:', renderedContent.substring(0, 200) + '...');
            
            // 确保modalBody元素存在
            if (modalBody) {
                modalBody.innerHTML = renderedContent;
                console.log('笔记内容已成功渲染到模态框');
            } else {
                console.error('无法找到modal-body元素');
            }
            
        } catch (error) {
            console.error('加载笔记内容失败:', error);
            modalBody.innerHTML = `<div class="py-8 text-center"><p class="text-red-400">无法加载笔记内容: ${error.message}</p></div>`;
        }
    }

    // 简单的Markdown渲染函数
    renderMarkdown(markdown) {
        console.log('开始渲染Markdown，内容长度:', markdown.length);
        
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
        
        // 改进的列表处理
        // 先处理无序列表
        const ulRegex = /^- (.*$)/gm;
        if (ulRegex.test(html)) {
            // 将连续的列表项包装在ul标签中
            const lines = html.split('\n');
            let result = '';
            let inList = false;
            
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].match(/^- /)) {
                    if (!inList) {
                        result += '<ul class="my-4 list-disc pl-6">\n';
                        inList = true;
                    }
                    result += '  <li class="mb-1">' + lines[i].replace(/^- /, '') + '</li>\n';
                } else {
                    if (inList) {
                        result += '</ul>\n';
                        inList = false;
                    }
                    result += lines[i] + '\n';
                }
            }
            
            if (inList) {
                result += '</ul>\n';
            }
            
            html = result.trim();
        }
        
        // 处理有序列表
        const olRegex = /^\d+\. (.*$)/gm;
        if (olRegex.test(html)) {
            // 将连续的有序列表项包装在ol标签中
            const lines = html.split('\n');
            let result = '';
            let inList = false;
            
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].match(/^\d+\. /)) {
                    if (!inList) {
                        result += '<ol class="my-4 list-decimal pl-6">\n';
                        inList = true;
                    }
                    result += '  <li class="mb-1">' + lines[i].replace(/^\d+\. /, '') + '</li>\n';
                } else {
                    if (inList) {
                        result += '</ol>\n';
                        inList = false;
                    }
                    result += lines[i] + '\n';
                }
            }
            
            if (inList) {
                result += '</ol>\n';
            }
            
            html = result.trim();
        }
        
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
    // 创建笔记管理器实例
    const notesManager = new NotesManager();
}

// 当页面加载完成后自动初始化笔记功能
if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', initNotes);
    } else {
        // DOM已经加载完成，直接初始化
        initNotes();
    }
}