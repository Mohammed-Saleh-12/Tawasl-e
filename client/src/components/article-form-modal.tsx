import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

interface ArticleFormModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

// Simple Modal Component with completely white interface
function SimpleModal({ isOpen, onClose, title, children }: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
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
          maxWidth: '800px',
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
          alignItems: 'center', 
          marginBottom: '24px', 
          borderBottom: '2px solid #e5e7eb', 
          paddingBottom: '20px',
          backgroundColor: '#ffffff'
        }}>
          <div style={{ backgroundColor: '#ffffff' }}>
            <h2 style={{ 
              fontSize: '28px', 
              fontWeight: 'bold', 
              margin: 0, 
              color: '#111827',
              textShadow: 'none',
              backgroundColor: '#ffffff'
            }}>
              {title}
            </h2>
            <p style={{ 
              margin: '8px 0 0 0', 
              color: '#6b7280',
              backgroundColor: '#ffffff'
            }}>
              Share your communication expertise with the community
            </p>
          </div>
          <button
            style={{
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
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#e5e7eb';
              e.currentTarget.style.color = '#374151';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.color = '#6b7280';
            }}
            onClick={onClose}
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 6L14 14M6 14L14 6" stroke="#374151" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div style={{ backgroundColor: '#ffffff' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function ArticleFormModal({ isOpen, onOpenChange }: ArticleFormModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    author: '',
    publishedAt: new Date().toISOString(),
    readTime: 5,
    imageUrl: ''
  });

  const { toast } = useToast();

  const createArticleMutation = useMutation({
    mutationFn: async (data: any) => {
      // Remove imageUrl if empty
      const payload = { ...data };
      if (!payload.imageUrl) {
        delete payload.imageUrl;
      }
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create article');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/articles'] });
      toast({
        title: "Success",
        description: "Article published successfully!",
      });
      onOpenChange(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to publish article. Please try again.",
        variant: "destructive"
      });
    }
  });

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      category: '',
      author: '',
      publishedAt: new Date().toISOString(),
      readTime: 5,
      imageUrl: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.excerpt || !formData.content || !formData.category || !formData.author) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    if (formData.title.length < 3) {
      toast({
        title: "Title Too Short",
        description: "Title must be at least 3 characters.",
        variant: "destructive"
      });
      return;
    }
    if (formData.excerpt.length < 10) {
      toast({
        title: "Excerpt Too Short",
        description: "Excerpt must be at least 10 characters.",
        variant: "destructive"
      });
      return;
    }
    if (formData.content.length < 20) {
      toast({
        title: "Content Too Short",
        description: "Content must be at least 20 characters.",
        variant: "destructive"
      });
      return;
    }
    createArticleMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <SimpleModal
      isOpen={isOpen}
      onClose={() => onOpenChange(false)}
      title="Create New Article"
    >
      <form onSubmit={handleSubmit} style={{ 
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        {/* Title */}
        <div style={{ backgroundColor: '#ffffff' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: 'bold', 
            color: '#374151',
            backgroundColor: '#ffffff'
          }}>
            Article Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="Enter a compelling title for your article..."
            required
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '16px',
              backgroundColor: '#ffffff',
              color: '#374151'
            }}
          />
        </div>

        {/* Author and Category Row */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '16px',
          backgroundColor: '#ffffff'
        }}>
          <div style={{ backgroundColor: '#ffffff' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 'bold', 
              color: '#374151',
              backgroundColor: '#ffffff'
            }}>
              Author Name *
            </label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => handleInputChange("author", e.target.value)}
              placeholder="Your name..."
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '16px',
                backgroundColor: '#ffffff',
                color: '#374151'
              }}
            />
          </div>

          <div style={{ backgroundColor: '#ffffff' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 'bold', 
              color: '#374151',
              backgroundColor: '#ffffff'
            }}>
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '16px',
                backgroundColor: '#ffffff',
                color: '#374151'
              }}
            >
              <option value="">Select a category</option>
              <option value="Verbal Communication">Verbal Communication</option>
              <option value="Non-Verbal Communication">Non-Verbal Communication</option>
              <option value="Active Listening">Active Listening</option>
              <option value="Body Language">Body Language</option>
              <option value="Presentation Skills">Presentation Skills</option>
              <option value="Digital Communication">Digital Communication</option>
              <option value="Interpersonal Skills">Interpersonal Skills</option>
              <option value="Workplace Communication">Workplace Communication</option>
              <option value="Team Communication">Team Communication</option>
            </select>
          </div>
        </div>

        {/* Read Time and Image URL Row */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 2fr', 
          gap: '16px',
          backgroundColor: '#ffffff'
        }}>
          <div style={{ backgroundColor: '#ffffff' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 'bold', 
              color: '#374151',
              backgroundColor: '#ffffff'
            }}>
              Read Time (minutes)
            </label>
            <input
              type="number"
              value={formData.readTime}
              onChange={(e) => handleInputChange("readTime", parseInt(e.target.value))}
              min="1"
              max="60"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '16px',
                backgroundColor: '#ffffff',
                color: '#374151'
              }}
            />
          </div>

          <div style={{ backgroundColor: '#ffffff' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 'bold', 
              color: '#374151',
              backgroundColor: '#ffffff'
            }}>
              Image URL (optional)
            </label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => handleInputChange("imageUrl", e.target.value)}
              placeholder="https://example.com/image.jpg"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '16px',
                backgroundColor: '#ffffff',
                color: '#374151'
              }}
            />
          </div>
        </div>

        {/* Excerpt */}
        <div style={{ backgroundColor: '#ffffff' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: 'bold', 
            color: '#374151',
            backgroundColor: '#ffffff'
          }}>
            Article Excerpt *
          </label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => handleInputChange("excerpt", e.target.value)}
            placeholder="Write a brief summary of your article..."
            rows={3}
            required
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '16px',
              backgroundColor: '#ffffff',
              color: '#374151',
              resize: 'vertical',
              minHeight: '80px'
            }}
          />
        </div>

        {/* Content */}
        <div style={{ backgroundColor: '#ffffff' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: 'bold', 
            color: '#374151',
            backgroundColor: '#ffffff'
          }}>
            Article Content *
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => handleInputChange("content", e.target.value)}
            placeholder="Write your full article content here. You can use markdown formatting..."
            rows={12}
            required
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '16px',
              backgroundColor: '#ffffff',
              color: '#374151',
              resize: 'vertical',
              minHeight: '300px'
            }}
          />
          <p style={{ 
            fontSize: '12px', 
            color: '#6b7280', 
            marginTop: '4px',
            backgroundColor: '#ffffff'
          }}>
            Tip: Use **bold**, *italic*, and bullet points to format your content
          </p>
        </div>

        {/* Form Actions */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '16px', 
          paddingTop: '24px', 
          borderTop: '1px solid #e5e7eb',
          backgroundColor: '#ffffff'
        }}>
          <div style={{ 
            display: 'flex', 
            gap: '12px',
            backgroundColor: '#ffffff'
          }}>
            <button
              type="button"
              onClick={() => {
                onOpenChange(false);
                resetForm();
              }}
              style={{
                flex: 1,
                padding: '12px 24px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                backgroundColor: '#ffffff',
                color: '#374151',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createArticleMutation.isPending}
              style={{
                flex: 1,
                padding: '12px 24px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: '#3B82F6',
                color: 'white',
                cursor: createArticleMutation.isPending ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                fontWeight: '500',
                opacity: createArticleMutation.isPending ? 0.6 : 1
              }}
            >
              {createArticleMutation.isPending ? (
                <>
                  <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                  Publishing...
                </>
              ) : (
                <>
                  <i className="fas fa-publish" style={{ marginRight: '8px' }}></i>
                  Publish Article
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </SimpleModal>
  );
}