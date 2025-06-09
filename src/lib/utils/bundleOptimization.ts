'use client';

import React from 'react';
import { logger } from '@/lib/utils/logger';

// Bundle analysis types
export interface BundleAnalysis {
  totalSize: number;
  gzippedSize: number;
  chunks: ChunkInfo[];
  dependencies: DependencyInfo[];
  unusedExports: string[];
  duplicates: DuplicateInfo[];
  recommendations: OptimizationRecommendation[];
}

export interface ChunkInfo {
  name: string;
  size: number;
  gzippedSize: number;
  modules: ModuleInfo[];
  isAsync: boolean;
  isEntry: boolean;
}

export interface ModuleInfo {
  name: string;
  size: number;
  reasons: string[];
  isUsed: boolean;
  exports: string[];
  unusedExports: string[];
}

export interface DependencyInfo {
  name: string;
  version: string;
  size: number;
  isDevDependency: boolean;
  isUsed: boolean;
  usageCount: number;
  alternatives?: string[];
}

export interface DuplicateInfo {
  module: string;
  instances: number;
  totalSize: number;
  chunks: string[];
}

export interface OptimizationRecommendation {
  type: 'remove' | 'replace' | 'split' | 'lazy-load' | 'tree-shake';
  target: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  estimatedSavings: number;
  implementation: string;
}

// Performance budget types
export interface PerformanceBudget {
  maxBundleSize: number;
  maxChunkSize: number;
  maxAssetSize: number;
  maxDependencies: number;
  allowedFileTypes: string[];
}

// Code splitting configuration
export interface CodeSplittingConfig {
  enableRouteBasedSplitting: boolean;
  enableComponentSplitting: boolean;
  enableVendorSplitting: boolean;
  chunkSizeThreshold: number;
  maxChunks: number;
  priorityRoutes: string[];
}

// Tree shaking configuration
export interface TreeShakingConfig {
  enableSideEffectsFree: boolean;
  preserveModules: string[];
  excludePatterns: string[];
  analyzeUsage: boolean;
}

const DEFAULT_PERFORMANCE_BUDGET: PerformanceBudget = {
  maxBundleSize: 500 * 1024, // 500KB
  maxChunkSize: 250 * 1024,  // 250KB
  maxAssetSize: 100 * 1024,  // 100KB
  maxDependencies: 50,
  allowedFileTypes: ['.js', '.ts', '.tsx', '.css', '.scss', '.json']
};

const DEFAULT_CODE_SPLITTING: CodeSplittingConfig = {
  enableRouteBasedSplitting: true,
  enableComponentSplitting: true,
  enableVendorSplitting: true,
  chunkSizeThreshold: 50 * 1024, // 50KB
  maxChunks: 10,
  priorityRoutes: ['/', '/about', '/contact']
};

const DEFAULT_TREE_SHAKING: TreeShakingConfig = {
  enableSideEffectsFree: true,
  preserveModules: ['polyfills'],
  excludePatterns: ['node_modules'],
  analyzeUsage: true
};

// Bundle optimization manager
class BundleOptimizationManager {
  private performanceBudget: PerformanceBudget;
  private codeSplittingConfig: CodeSplittingConfig;
  private treeShakingConfig: TreeShakingConfig;
  private isClient: boolean;

  constructor(
    performanceBudget: Partial<PerformanceBudget> = {},
    codeSplittingConfig: Partial<CodeSplittingConfig> = {},
    treeShakingConfig: Partial<TreeShakingConfig> = {}
  ) {
    this.performanceBudget = { ...DEFAULT_PERFORMANCE_BUDGET, ...performanceBudget };
    this.codeSplittingConfig = { ...DEFAULT_CODE_SPLITTING, ...codeSplittingConfig };
    this.treeShakingConfig = { ...DEFAULT_TREE_SHAKING, ...treeShakingConfig };
    this.isClient = typeof window !== 'undefined';
  }

  /**
   * Analyze current bundle
   */
  async analyzeBundleSize(): Promise<BundleAnalysis> {
    const analysis: BundleAnalysis = {
      totalSize: 0,
      gzippedSize: 0,
      chunks: [],
      dependencies: [],
      unusedExports: [],
      duplicates: [],
      recommendations: []
    };

    try {
      // Analyze loaded scripts
      if (this.isClient) {
        analysis.chunks = this.analyzeLoadedChunks();
        analysis.totalSize = analysis.chunks.reduce((sum, chunk) => sum + chunk.size, 0);
        analysis.gzippedSize = analysis.chunks.reduce((sum, chunk) => sum + chunk.gzippedSize, 0);
      }

      // Analyze dependencies
      analysis.dependencies = await this.analyzeDependencies();
      
      // Find duplicates
      analysis.duplicates = this.findDuplicateModules(analysis.chunks);
      
      // Generate recommendations
      analysis.recommendations = this.generateRecommendations(analysis);
      
      logger.info('Bundle analysis completed', {
        metadata: {
          totalSize: analysis.totalSize,
          chunks: analysis.chunks.length,
          dependencies: analysis.dependencies.length,
          recommendations: analysis.recommendations.length
        }
      });
      
      return analysis;
    } catch (error) {
      logger.error('Bundle analysis failed', error as Error);
      return analysis;
    }
  }

  /**
   * Check performance budget
   */
  checkPerformanceBudget(analysis: BundleAnalysis): {
    passed: boolean;
    violations: string[];
    warnings: string[];
  } {
    const violations: string[] = [];
    const warnings: string[] = [];

    // Check total bundle size
    if (analysis.totalSize > this.performanceBudget.maxBundleSize) {
      violations.push(
        `Bundle size (${this.formatBytes(analysis.totalSize)}) exceeds budget (${this.formatBytes(this.performanceBudget.maxBundleSize)})`
      );
    }

    // Check individual chunk sizes
    analysis.chunks.forEach(chunk => {
      if (chunk.size > this.performanceBudget.maxChunkSize) {
        violations.push(
          `Chunk '${chunk.name}' size (${this.formatBytes(chunk.size)}) exceeds budget (${this.formatBytes(this.performanceBudget.maxChunkSize)})`
        );
      }
    });

    // Check dependency count
    const usedDependencies = analysis.dependencies.filter(dep => dep.isUsed);
    if (usedDependencies.length > this.performanceBudget.maxDependencies) {
      warnings.push(
        `Number of dependencies (${usedDependencies.length}) exceeds recommended limit (${this.performanceBudget.maxDependencies})`
      );
    }

    // Check for unused dependencies
    const unusedDependencies = analysis.dependencies.filter(dep => !dep.isUsed);
    if (unusedDependencies.length > 0) {
      warnings.push(
        `Found ${unusedDependencies.length} unused dependencies: ${unusedDependencies.map(d => d.name).join(', ')}`
      );
    }

    return {
      passed: violations.length === 0,
      violations,
      warnings
    };
  }

  /**
   * Generate webpack configuration for optimization
   */
  generateWebpackConfig(): any {
    return {
      optimization: {
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              enforce: true
            },
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              enforce: true
            }
          }
        },
        usedExports: this.treeShakingConfig.enableSideEffectsFree,
        sideEffects: false
      },
      resolve: {
        alias: this.generateAliases()
      },
      module: {
        rules: [
          {
            test: /\.(js|ts|tsx)$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  ['@babel/preset-env', { modules: false }],
                  '@babel/preset-react',
                  '@babel/preset-typescript'
                ],
                plugins: [
                  ['import', { libraryName: 'lodash', libraryDirectory: '', camel2DashComponentName: false }, 'lodash'],
                  ['import', { libraryName: 'antd', style: true }, 'antd']
                ]
              }
            }
          }
        ]
      }
    };
  }

  /**
   * Generate Next.js configuration for optimization
   */
  generateNextConfig(): any {
    return {
      experimental: {
        optimizeCss: true,
        optimizeImages: true,
        optimizeServerReact: true
      },
      compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
        reactRemoveProperties: process.env.NODE_ENV === 'production'
      },
      webpack: (config: any, { dev, isServer }: any) => {
        // Enable tree shaking
        if (!dev) {
          config.optimization.usedExports = true;
          config.optimization.sideEffects = false;
        }

        // Bundle analyzer
        if (process.env.ANALYZE === 'true') {
          const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
          config.plugins.push(
            new BundleAnalyzerPlugin({
              analyzerMode: 'static',
              openAnalyzer: false,
              reportFilename: isServer ? '../analyze/server.html' : './analyze/client.html'
            })
          );
        }

        // Optimize chunks
        if (!isServer) {
          config.optimization.splitChunks = {
            ...config.optimization.splitChunks,
            cacheGroups: {
              ...config.optimization.splitChunks.cacheGroups,
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendors',
                chunks: 'all'
              }
            }
          };
        }

        return config;
      }
    };
  }

  /**
   * Get dynamic import suggestions
   */
  getDynamicImportSuggestions(): string[] {
    return [
      // Large UI libraries
      'import dynamic from "next/dynamic";\nconst Chart = dynamic(() => import("react-chartjs-2"), { ssr: false });',
      
      // Heavy components
      'const HeavyComponent = dynamic(() => import("./HeavyComponent"), {\n  loading: () => <div>Loading...</div>\n});',
      
      // Route-based splitting
      'const AdminPanel = dynamic(() => import("./AdminPanel"), {\n  loading: () => <div>Loading admin panel...</div>\n});',
      
      // Conditional imports
      'const DevTools = dynamic(() => import("./DevTools"), {\n  ssr: false,\n  loading: () => null\n});'
    ];
  }

  /**
   * Get tree shaking suggestions
   */
  getTreeShakingSuggestions(): string[] {
    return [
      // Lodash optimization
      'import debounce from "lodash/debounce"; // Instead of import { debounce } from "lodash"',
      
      // Date library optimization
      'import { format } from "date-fns/format"; // Instead of import { format } from "date-fns"',
      
      // Icon library optimization
      'import { FaHome } from "react-icons/fa"; // Instead of import * as Icons from "react-icons/fa"',
      
      // Utility library optimization
      'import clsx from "clsx"; // Instead of import classNames from "classnames"'
    ];
  }

  /**
   * Update configuration
   */
  updateConfig(
    performanceBudget?: Partial<PerformanceBudget>,
    codeSplittingConfig?: Partial<CodeSplittingConfig>,
    treeShakingConfig?: Partial<TreeShakingConfig>
  ): void {
    if (performanceBudget) {
      this.performanceBudget = { ...this.performanceBudget, ...performanceBudget };
    }
    if (codeSplittingConfig) {
      this.codeSplittingConfig = { ...this.codeSplittingConfig, ...codeSplittingConfig };
    }
    if (treeShakingConfig) {
      this.treeShakingConfig = { ...this.treeShakingConfig, ...treeShakingConfig };
    }
  }

  // Private methods
  private analyzeLoadedChunks(): ChunkInfo[] {
    if (!this.isClient) return [];

    const chunks: ChunkInfo[] = [];
    const scripts = document.querySelectorAll('script[src]');
    
    scripts.forEach((script, index) => {
      const src = (script as HTMLScriptElement).src;
      if (src && src.includes('/_next/static/')) {
        const name = src.split('/').pop() || `chunk-${index}`;
        
        // Estimate size (this would be more accurate with actual webpack stats)
        const estimatedSize = this.estimateScriptSize(script as HTMLScriptElement);
        
        chunks.push({
          name,
          size: estimatedSize,
          gzippedSize: Math.round(estimatedSize * 0.7), // Rough estimate
          modules: [],
          isAsync: script.hasAttribute('async'),
          isEntry: src.includes('main') || src.includes('pages')
        });
      }
    });
    
    return chunks;
  }

  private async analyzeDependencies(): Promise<DependencyInfo[]> {
    // In a real implementation, this would analyze package.json and usage
    // For now, return common dependencies with estimates
    return [
      {
        name: 'react',
        version: '18.0.0',
        size: 42 * 1024,
        isDevDependency: false,
        isUsed: true,
        usageCount: 100
      },
      {
        name: 'next',
        version: '13.0.0',
        size: 500 * 1024,
        isDevDependency: false,
        isUsed: true,
        usageCount: 50
      },
      {
        name: 'lodash',
        version: '4.17.21',
        size: 70 * 1024,
        isDevDependency: false,
        isUsed: false,
        usageCount: 0,
        alternatives: ['lodash-es', 'ramda']
      }
    ];
  }

  private findDuplicateModules(chunks: ChunkInfo[]): DuplicateInfo[] {
    const moduleMap = new Map<string, { count: number; size: number; chunks: string[] }>();
    
    chunks.forEach(chunk => {
      chunk.modules.forEach(module => {
        const existing = moduleMap.get(module.name);
        if (existing) {
          existing.count++;
          existing.size += module.size;
          existing.chunks.push(chunk.name);
        } else {
          moduleMap.set(module.name, {
            count: 1,
            size: module.size,
            chunks: [chunk.name]
          });
        }
      });
    });
    
    return Array.from(moduleMap.entries())
      .filter(([, info]) => info.count > 1)
      .map(([module, info]) => ({
        module,
        instances: info.count,
        totalSize: info.size,
        chunks: info.chunks
      }));
  }

  private generateRecommendations(analysis: BundleAnalysis): OptimizationRecommendation[] {
    const recommendations: OptimizationRecommendation[] = [];
    
    // Large bundle recommendation
    if (analysis.totalSize > this.performanceBudget.maxBundleSize) {
      recommendations.push({
        type: 'split',
        target: 'main bundle',
        description: 'Bundle size exceeds performance budget. Consider code splitting.',
        impact: 'high',
        estimatedSavings: analysis.totalSize - this.performanceBudget.maxBundleSize,
        implementation: 'Use dynamic imports and route-based code splitting'
      });
    }
    
    // Unused dependencies
    const unusedDeps = analysis.dependencies.filter(dep => !dep.isUsed);
    unusedDeps.forEach(dep => {
      recommendations.push({
        type: 'remove',
        target: dep.name,
        description: `Unused dependency: ${dep.name}`,
        impact: 'medium',
        estimatedSavings: dep.size,
        implementation: `Remove from package.json: npm uninstall ${dep.name}`
      });
    });
    
    // Duplicate modules
    analysis.duplicates.forEach(duplicate => {
      if (duplicate.instances > 2) {
        recommendations.push({
          type: 'split',
          target: duplicate.module,
          description: `Module ${duplicate.module} is duplicated ${duplicate.instances} times`,
          impact: 'medium',
          estimatedSavings: duplicate.totalSize * 0.8,
          implementation: 'Extract to shared chunk or use webpack optimization'
        });
      }
    });
    
    // Large chunks
    analysis.chunks.forEach(chunk => {
      if (chunk.size > this.performanceBudget.maxChunkSize) {
        recommendations.push({
          type: 'split',
          target: chunk.name,
          description: `Chunk ${chunk.name} is too large`,
          impact: 'high',
          estimatedSavings: chunk.size - this.performanceBudget.maxChunkSize,
          implementation: 'Split chunk into smaller pieces using dynamic imports'
        });
      }
    });
    
    return recommendations.sort((a, b) => {
      const impactOrder = { high: 3, medium: 2, low: 1 };
      return impactOrder[b.impact] - impactOrder[a.impact];
    });
  }

  private generateAliases(): Record<string, string> {
    return {
      '@': './src',
      '@components': './src/components',
      '@utils': './src/lib/utils',
      '@styles': './src/styles',
      '@types': './src/types'
    };
  }

  private estimateScriptSize(script: HTMLScriptElement): number {
    // This is a rough estimation - in reality, you'd get this from webpack stats
    const src = script.src;
    if (src.includes('main')) return 100 * 1024;
    if (src.includes('vendor')) return 200 * 1024;
    if (src.includes('chunk')) return 50 * 1024;
    return 25 * 1024;
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Create singleton instance
export const bundleOptimizer = new BundleOptimizationManager();

// Utility functions

/**
 * Lazy load component with error boundary
 */
export function lazyLoadComponent<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
): React.ComponentType {
  const LazyComponent = React.lazy(importFn);
  
  return (props: any) => (
    React.createElement(React.Suspense, {
      fallback: fallback ? React.createElement(fallback) : React.createElement('div', null, 'Loading...')
    }, React.createElement(LazyComponent, props))
  );
}

/**
 * Preload component for better UX
 */
export function preloadComponent(importFn: () => Promise<any>): void {
  if (typeof window !== 'undefined') {
    // Preload on idle or after a delay
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => importFn());
    } else {
      setTimeout(() => importFn(), 100);
    }
  }
}

/**
 * Check if module should be tree-shaken
 */
export function shouldTreeShake(moduleName: string): boolean {
  const treeShakableModules = [
    'lodash',
    'date-fns',
    'react-icons',
    'antd',
    'material-ui'
  ];
  
  return treeShakableModules.some(mod => moduleName.includes(mod));
}

/**
 * Get optimized import statement
 */
export function getOptimizedImport(moduleName: string, imports: string[]): string {
  const optimizations: Record<string, (imports: string[]) => string> = {
    'lodash': (imports) => imports.map(imp => `import ${imp} from 'lodash/${imp}';`).join('\n'),
    'date-fns': (imports) => imports.map(imp => `import ${imp} from 'date-fns/${imp}';`).join('\n'),
    'react-icons': (imports) => {
      const grouped = imports.reduce((acc, imp) => {
        const prefix = imp.substring(0, 2).toLowerCase();
        if (!acc[prefix]) acc[prefix] = [];
        acc[prefix].push(imp);
        return acc;
      }, {} as Record<string, string[]>);
      
      return Object.entries(grouped)
        .map(([prefix, icons]) => `import { ${icons.join(', ')} } from 'react-icons/${prefix}';`)
        .join('\n');
    }
  };
  
  const optimizer = optimizations[moduleName];
  return optimizer ? optimizer(imports) : `import { ${imports.join(', ')} } from '${moduleName}';`;
}

/**
 * Analyze bundle in development
 */
export async function analyzeBundleInDev(): Promise<void> {
  if (process.env.NODE_ENV === 'development') {
    const analysis = await bundleOptimizer.analyzeBundleSize();
    const budget = bundleOptimizer.checkPerformanceBudget(analysis);
    
    console.group('📦 Bundle Analysis');
    console.log('Total Size:', bundleOptimizer['formatBytes'](analysis.totalSize));
    console.log('Chunks:', analysis.chunks.length);
    console.log('Dependencies:', analysis.dependencies.length);
    
    if (!budget.passed) {
      console.warn('❌ Performance Budget Violations:');
      budget.violations.forEach(violation => console.warn('  -', violation));
    }
    
    if (budget.warnings.length > 0) {
      console.warn('⚠️ Warnings:');
      budget.warnings.forEach(warning => console.warn('  -', warning));
    }
    
    if (analysis.recommendations.length > 0) {
      console.log('💡 Recommendations:');
      analysis.recommendations.slice(0, 5).forEach(rec => {
        console.log(`  ${rec.impact.toUpperCase()}: ${rec.description}`);
        console.log(`    Implementation: ${rec.implementation}`);
      });
    }
    
    console.groupEnd();
  }
}

export default bundleOptimizer;