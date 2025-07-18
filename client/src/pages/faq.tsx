import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import FAQFormModal from "@/components/faq-form-modal";
import { apiClient } from "@/lib/api";
import type { FAQ } from "@shared/schema";

export default function FAQ() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Topics");
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('platform_logged_in') === 'true';

  const { data: faqs, isLoading, error } = useQuery<FAQ[]>({
    queryKey: ["/api/faqs", search, selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (selectedCategory !== "All Topics") params.append("category", selectedCategory);
      return await apiClient.get(`/faqs?${params}`);
    }
  });

  const categories = [
    "All Topics",
    "General",
    "Platform",
    "Verbal Communication",
    "Body Language",
    "Presentations",
    "Platform Usage"
  ];

  const toggleItem = (id: number) => {
    const newOpenItems = new Set(openItems);
    if (openItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  const handleEdit = (faq: FAQ) => {
    setSelectedFAQ(faq);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = async (faq: FAQ, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete "${faq.question}"?`)) {
      try {
        await apiClient.delete(`/faqs/${faq.id}`);
        // Refetch FAQs after deletion
        queryClient.invalidateQueries({ queryKey: ["/api/faqs"] });
      } catch (error: any) {
        console.error('Error deleting FAQ:', error);
        alert('Error deleting FAQ: ' + (error?.response?.data?.error || error.message || error));
      }
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back to Home Button for Logged-in Users */}
      {isLoggedIn && (
        <div className="mb-6">
          <Button 
            onClick={() => setLocation('/')}
            variant="outline"
            className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
          >
            <i className="fas fa-arrow-left"></i>
            Back to Home
          </Button>
        </div>
      )}

      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
        <p className="text-xl text-gray-600">
          Find answers to common questions about communication skills and our platform
        </p>
        {isLoggedIn && (
          <div className="mt-6">
            <Button onClick={() => setIsCreateModalOpen(true)} className="btn-primary">
              <i className="fas fa-plus mr-2"></i>
              Add FAQ
            </Button>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search FAQ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
          <i className="fas fa-search absolute left-3 top-3.5 text-gray-400"></i>
        </div>
      </div>

      {/* FAQ Categories */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                selectedCategory === category 
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105" 
                  : "border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-700 hover:text-blue-700 hover:scale-105"
              }`}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* FAQ Items */}
      {isLoading ? (
        <div className="space-y-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : faqs && faqs.length > 0 ? (
        <div className="space-y-6">
          {faqs.map((faq) => (
            <Card key={faq.id} className="shadow-lg">
              <Collapsible open={openItems.has(faq.id)} onOpenChange={() => toggleItem(faq.id)}>
                <CollapsibleTrigger className="w-full text-left p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                  <div className="flex items-center gap-2">
                    {isLoggedIn && (
                      <>
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={(e) => { e.stopPropagation(); handleEdit(faq); }}
                          className="inline-flex items-center justify-center p-2 rounded hover:bg-gray-100 cursor-pointer"
                          style={{ outline: 'none' }}
                        >
                          <i className="fas fa-edit text-gray-500"></i>
                        </span>
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={(e) => { e.stopPropagation(); handleDeleteClick(faq, e); }}
                          className="inline-flex items-center justify-center p-2 rounded hover:bg-gray-100 cursor-pointer"
                          style={{ outline: 'none' }}
                        >
                          <i className="fas fa-trash text-red-500"></i>
                        </span>
                      </>
                    )}
                    <i className={`fas fa-chevron-down text-gray-400 transform transition-transform ${
                      openItems.has(faq.id) ? 'rotate-180' : ''
                    }`}></i>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="px-6 pb-6">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <i className="fas fa-question-circle text-4xl"></i>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No FAQs found</h3>
          <p className="text-gray-600">
            {search || selectedCategory !== "All Topics" 
              ? "Try adjusting your search or filter criteria."
              : "FAQs will appear here when available."
            }
          </p>
        </div>
      )}

      {/* FAQ Creation Modal */}
      <FAQFormModal 
        isOpen={isCreateModalOpen} 
        onOpenChange={setIsCreateModalOpen} 
        mode="create"
      />

      {/* FAQ Edit Modal */}
      {selectedFAQ && (
        <FAQFormModal 
          isOpen={isEditModalOpen} 
          onOpenChange={setIsEditModalOpen}
          faq={selectedFAQ}
          mode="edit"
        />
      )}
    </main>
  );
}
