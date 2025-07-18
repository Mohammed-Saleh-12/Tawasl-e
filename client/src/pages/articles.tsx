import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ArticleFormModal from "@/components/article-form-modal";
import { apiClient } from "@/lib/api";
import type { Article } from "@shared/schema";

// Simple Modal Component for Article Reading
function SimpleArticleModal({ isOpen, onClose, children }: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(4px)'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: '#ffffff',
          padding: '32px',
          borderRadius: '12px',
          maxWidth: '900px',
          width: '95%',
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #e5e7eb'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start', 
          marginBottom: '24px', 
          borderBottom: '2px solid #e5e7eb', 
          paddingBottom: '20px',
          backgroundColor: '#ffffff'
        }}>
          <div style={{ backgroundColor: '#ffffff', flex: 1 }}>
            {children}
          </div>
          <button 
            onClick={onClose}
            style={{
              background: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '50%',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '8px',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6b7280',
              transition: 'all 0.2s ease',
              marginLeft: '16px',
              flexShrink: 0
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#e5e7eb';
              e.currentTarget.style.color = '#374151';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.color = '#6b7280';
            }}
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Articles() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('platform_logged_in') === 'true';

  const { data: articles, isLoading, error } = useQuery<Article[]>({
    queryKey: ["/api/articles", search, category],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (category !== "All Categories") params.append("category", category);
      return await apiClient.get(`/articles?${params}`);
    }
  });

  const categories = [
    "All Categories",
    "Verbal Communication",
    "Non-Verbal Communication", 
    "Active Listening",
    "Body Language",
    "Presentation Skills",
    "Digital Communication",
    "Interpersonal Skills",
    "Workplace Communication",
    "Team Communication"
  ];

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Verbal Communication": "text-blue-600 bg-blue-100",
      "Non-Verbal Communication": "text-purple-600 bg-purple-100",
      "Active Listening": "text-green-600 bg-green-100",
      "Body Language": "text-orange-600 bg-orange-100",
      "Presentation Skills": "text-red-600 bg-red-100",
      "Digital Communication": "text-indigo-600 bg-indigo-100",
      "Interpersonal Skills": "text-pink-600 bg-pink-100",
      "Workplace Communication": "text-teal-600 bg-teal-100",
      "Team Communication": "text-yellow-600 bg-yellow-100"
    };
    return colors[category] || "text-gray-600 bg-gray-100";
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const openArticleModal = (article: Article) => {
    setSelectedArticle(article);
    setIsArticleModalOpen(true);
  };

  const handleDeleteClick = async (article: Article, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete "${article.title}"?`)) {
      try {
        await apiClient.delete(`/articles/${article.id}`);
        // Refetch articles after deletion
        queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      } catch (error: any) {
        console.error('Error deleting article:', error);
        alert('Error deleting article: ' + (error?.response?.data?.error || error.message || error));
      }
    }
  };

  const formatContent = (content: string) => {
    // Simple markdown-like formatting
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('**') && line.endsWith('**')) {
          return <strong key={index} style={{ backgroundColor: '#ffffff' }}>{line.slice(2, -2)}</strong>;
        }
        if (line.startsWith('*') && line.endsWith('*')) {
          return <em key={index} style={{ backgroundColor: '#ffffff' }}>{line.slice(1, -1)}</em>;
        }
        if (line.startsWith('- ')) {
          return <li key={index} style={{ backgroundColor: '#ffffff' }}>{line.slice(2)}</li>;
        }
        if (line.trim() === '') {
          return <br key={index} />;
        }
        return <p key={index} style={{ backgroundColor: '#ffffff', marginBottom: '12px' }}>{line}</p>;
      });
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back to Home Button for Logged-in Users */}
      {isLoggedIn && (
        <div className="mb-6">
          <Button 
            onClick={() => setLocation('/')}
            variant="outline"
            className="flex items-center gap-2 bg-white border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-700 transition-all duration-200 shadow-sm"
          >
            <i className="fas fa-arrow-left"></i>
            Back to Home
          </Button>
        </div>
      )}

      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Communication Skills Articles</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Learn from expert insights and practical guides to improve your communication abilities
        </p>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Articles</h1>
            <p className="text-gray-600 mt-2">Discover insights on communication and presentation skills</p>
          </div>
          {isLoggedIn && (
            <Button onClick={() => setIsCreateModalOpen(true)} className="btn-primary">
              <i className="fas fa-plus mr-2"></i>
              Add Article
            </Button>
          )}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
            <i className="fas fa-search absolute left-3 top-3.5 text-gray-400"></i>
          </div>
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="max-w-md mx-auto bg-white border-gray-300 hover:border-blue-400 focus:border-blue-500">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg">
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat} className="hover:bg-blue-50 focus:bg-blue-50">
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Articles Grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="w-full h-48" />
              <CardContent className="p-6">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-6 w-full mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : articles && articles.length > 0 ? (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Card key={article.id} className="overflow-hidden card-hover">
                {article.imageUrl && (
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <CardContent className="p-6">
                  <div className={`text-sm font-semibold mb-2 ${getCategoryColor(article.category)}`}>
                    {article.category.toUpperCase()}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{article.title}</h3>
                  <p className="text-gray-600 mb-4">{article.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <i className="far fa-clock mr-1"></i>
                      <span>{article.readTime} min read</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 h-auto font-medium transition-all duration-200"
                      onClick={() => openArticleModal(article)}
                    >
                      Read More <i className="fas fa-arrow-right ml-1"></i>
                    </Button>
                  </div>
                  <div className="mt-3 text-xs text-gray-400">
                    By {article.author} • {formatDate(article.publishedAt)}
                  </div>
                  <div className="flex justify-end gap-2 mt-2">
                    {isLoggedIn && (
                      <>
                        <Button size="sm" variant="outline" onClick={() => openArticleModal(article)}>
                          <i className="fas fa-edit mr-1"></i> Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={(e) => handleDeleteClick(article, e)}>
                          <i className="fas fa-trash mr-1"></i> Delete
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 font-medium">
              Load More Articles
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <i className="fas fa-search text-4xl"></i>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
          <p className="text-gray-600">
            {search || category !== "All Categories" 
              ? "Try adjusting your search or filter criteria."
              : "Articles will appear here when available."
            }
          </p>
        </div>
      )}

      {/* Article Creation Modal */}
      <ArticleFormModal 
        isOpen={isCreateModalOpen} 
        onOpenChange={setIsCreateModalOpen} 
      />

      {/* Article Reading Modal */}
      {selectedArticle && (
        <SimpleArticleModal
          isOpen={isArticleModalOpen}
          onClose={() => setIsArticleModalOpen(false)}
        >
          <div style={{ backgroundColor: '#ffffff' }}>
            {/* Article Header */}
            <div style={{ 
              marginBottom: '24px',
              backgroundColor: '#ffffff'
            }}>
              <div style={{ 
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 'bold',
                marginBottom: '8px',
                backgroundColor: '#ffffff'
              }} className={getCategoryColor(selectedArticle.category)}>
                {selectedArticle.category.toUpperCase()}
              </div>
              <h2 style={{ 
                fontSize: '28px', 
                fontWeight: 'bold', 
                color: '#111827',
                margin: '0 0 12px 0',
                backgroundColor: '#ffffff'
              }}>
                {selectedArticle.title}
              </h2>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '16px',
                fontSize: '14px',
                color: '#6b7280',
                backgroundColor: '#ffffff'
              }}>
                <span>By {selectedArticle.author}</span>
                <span>•</span>
                <span>{formatDate(selectedArticle.publishedAt)}</span>
                <span>•</span>
                <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#ffffff' }}>
                  <i className="far fa-clock" style={{ marginRight: '4px' }}></i>
                  <span>{selectedArticle.readTime} min read</span>
                </div>
              </div>
            </div>
            
            {/* Article Content */}
            <div style={{ backgroundColor: '#ffffff' }}>
              {selectedArticle.imageUrl && (
                <img
                  src={selectedArticle.imageUrl}
                  alt={selectedArticle.title}
                  style={{
                    width: '100%',
                    height: '256px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    marginBottom: '24px'
                  }}
                />
              )}
              
              <div style={{ backgroundColor: '#ffffff' }}>
                <div style={{ 
                  fontSize: '18px', 
                  color: '#374151', 
                  marginBottom: '24px', 
                  fontWeight: '500',
                  backgroundColor: '#ffffff'
                }}>
                  {selectedArticle.excerpt}
                </div>
                
                <div style={{ 
                  color: '#374151', 
                  lineHeight: '1.7',
                  backgroundColor: '#ffffff'
                }}>
                  {formatContent(selectedArticle.content)}
                </div>
              </div>
              
              <div style={{ 
                paddingTop: '24px', 
                borderTop: '1px solid #e5e7eb',
                marginTop: '24px',
                backgroundColor: '#ffffff'
              }}>
                <button 
                  onClick={() => setIsArticleModalOpen(false)}
                  style={{
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)';
                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)';
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  Close Article
                </button>
              </div>
            </div>
          </div>
        </SimpleArticleModal>
      )}
    </main>
  );
}
