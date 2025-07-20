import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ContentValidator {
  constructor() {
    this.contentDir = path.join(__dirname, '..');
    this.errors = [];
    this.warnings = [];
  }

  async validate() {
    console.log('开始验证内容...');
    
    // 验证配置文件
    await this.validateConfigs();
    
    // 验证文章
    await this.validateArticles();
    
    // 验证项目数据
    await this.validateProjects();
    
    // 验证设计数据
    await this.validateDesigns();
    
    // 验证视频数据
    await this.validateVideos();
    
    // 输出结果
    this.printResults();
  }

  async validateConfigs() {
    const configDir = path.join(this.contentDir, 'config');
    
    // 验证分类配置
    const categoriesFile = path.join(configDir, 'categories.yaml');
    if (fs.existsSync(categoriesFile)) {
      try {
        const content = fs.readFileSync(categoriesFile, 'utf8');
        const categories = yaml.load(content);
        
        if (!categories.categories || !Array.isArray(categories.categories)) {
          this.errors.push('categories.yaml: categories字段必须是数组');
        } else {
          categories.categories.forEach((category, index) => {
            if (!category.id || !category.name) {
              this.errors.push(`categories.yaml: 第${index + 1}个分类缺少id或name字段`);
            }
          });
        }
      } catch (error) {
        this.errors.push(`categories.yaml: ${error.message}`);
      }
    } else {
      this.warnings.push('categories.yaml文件不存在');
    }
    
    // 验证标签配置
    const tagsFile = path.join(configDir, 'tags.yaml');
    if (fs.existsSync(tagsFile)) {
      try {
        const content = fs.readFileSync(tagsFile, 'utf8');
        const tags = yaml.load(content);
        
        if (!tags.tags || !Array.isArray(tags.tags)) {
          this.errors.push('tags.yaml: tags字段必须是数组');
        }
      } catch (error) {
        this.errors.push(`tags.yaml: ${error.message}`);
      }
    } else {
      this.warnings.push('tags.yaml文件不存在');
    }
  }

  async validateArticles() {
    const articlesDir = path.join(this.contentDir, 'articles');
    if (!fs.existsSync(articlesDir)) {
      this.warnings.push('articles目录不存在');
      return;
    }
    
    let articleCount = 0;
    let errorCount = 0;
    
    this.walkArticles(articlesDir, (filePath) => {
      articleCount++;
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const { data, content: markdown } = matter(content);
        
        // 验证必需字段
        if (!data.title) {
          this.errors.push(`${filePath}: 缺少title字段`);
          errorCount++;
        }
        
        if (!data.date) {
          this.errors.push(`${filePath}: 缺少date字段`);
          errorCount++;
        }
        
        if (!data.category) {
          this.errors.push(`${filePath}: 缺少category字段`);
          errorCount++;
        }
        
        // 验证日期格式
        if (data.date && !this.isValidDate(data.date)) {
          this.errors.push(`${filePath}: date格式不正确，应为YYYY-MM-DD`);
          errorCount++;
        }
        
        // 验证标签格式
        if (data.tags && !Array.isArray(data.tags)) {
          this.errors.push(`${filePath}: tags必须是数组`);
          errorCount++;
        }
        
        // 验证内容不为空
        if (!markdown.trim()) {
          this.errors.push(`${filePath}: 文章内容为空`);
          errorCount++;
        }
        
      } catch (error) {
        this.errors.push(`${filePath}: ${error.message}`);
        errorCount++;
      }
    });
    
    console.log(`验证了 ${articleCount} 篇文章，发现 ${errorCount} 个错误`);
  }

  async validateProjects() {
    const projectsDir = path.join(this.contentDir, 'projects');
    if (fs.existsSync(projectsDir)) {
      const files = fs.readdirSync(projectsDir);
      files.forEach(file => {
        if (file.endsWith('.yaml') || file.endsWith('.yml')) {
          const filePath = path.join(projectsDir, file);
          try {
            const content = fs.readFileSync(filePath, 'utf8');
            yaml.load(content);
          } catch (error) {
            this.errors.push(`${filePath}: ${error.message}`);
          }
        }
      });
    }
  }

  async validateDesigns() {
    const designsDir = path.join(this.contentDir, 'designs');
    if (fs.existsSync(designsDir)) {
      const files = fs.readdirSync(designsDir);
      files.forEach(file => {
        if (file.endsWith('.yaml') || file.endsWith('.yml')) {
          const filePath = path.join(designsDir, file);
          try {
            const content = fs.readFileSync(filePath, 'utf8');
            yaml.load(content);
          } catch (error) {
            this.errors.push(`${filePath}: ${error.message}`);
          }
        }
      });
    }
  }

  async validateVideos() {
    const videosDir = path.join(this.contentDir, 'videos');
    if (fs.existsSync(videosDir)) {
      const files = fs.readdirSync(videosDir);
      files.forEach(file => {
        if (file.endsWith('.yaml') || file.endsWith('.yml')) {
          const filePath = path.join(videosDir, file);
          try {
            const content = fs.readFileSync(filePath, 'utf8');
            yaml.load(content);
          } catch (error) {
            this.errors.push(`${filePath}: ${error.message}`);
          }
        }
      });
    }
  }

  walkArticles(dir, callback) {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        this.walkArticles(filePath, callback);
      } else if (file.endsWith('.md') || file.endsWith('.mdx')) {
        callback(filePath);
      }
    });
  }

  isValidDate(dateString) {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date) && dateString.match(/^\d{4}-\d{2}-\d{2}$/);
  }

  printResults() {
    console.log('\n=== 验证结果 ===');
    
    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('✅ 所有内容验证通过！');
      return;
    }
    
    if (this.errors.length > 0) {
      console.log(`❌ 发现 ${this.errors.length} 个错误:`);
      this.errors.forEach(error => {
        console.log(`  - ${error}`);
      });
    }
    
    if (this.warnings.length > 0) {
      console.log(`⚠️  发现 ${this.warnings.length} 个警告:`);
      this.warnings.forEach(warning => {
        console.log(`  - ${warning}`);
      });
    }
    
    if (this.errors.length > 0) {
      process.exit(1);
    }
  }
}

// 执行验证
const validator = new ContentValidator();
validator.validate().catch(console.error); 