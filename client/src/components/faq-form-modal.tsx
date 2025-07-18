import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";

interface FAQ {
  id?: number;
  question: string;
  answer: string;
  category: string;
}

interface FAQFormModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  faq?: FAQ;
  mode: 'create' | 'edit';
}

const categories = [
  'general',
  'communication-skills',
  'public-speaking',
  'interview-preparation',
  'team-collaboration',
  'conflict-resolution',
  'body-language',
  'active-listening'
];

export default function FAQFormModal({ isOpen, onOpenChange, faq, mode }: FAQFormModalProps) {
  const [formData, setFormData] = useState<FAQ>({
    question: faq?.question || '',
    answer: faq?.answer || '',
    category: faq?.category || 'general'
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createMutation = useMutation({
    mutationFn: async (data: FAQ) => {
      return await apiClient.post('/faqs', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/faqs'] });
      toast({
        title: "Success",
        description: "FAQ created successfully!",
      });
      onOpenChange(false);
      setFormData({ question: '', answer: '', category: 'general' });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create FAQ. Please try again.",
        variant: "destructive"
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (data: FAQ) => {
      return await apiClient.put(`/api/faqs/${faq?.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/faqs'] });
      toast({
        title: "Success",
        description: "FAQ updated successfully!",
      });
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update FAQ. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question.trim() || !formData.answer.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    if (mode === 'create') {
      createMutation.mutate(formData);
    } else {
      if (!faq?.id) {
        toast({
          title: "Error",
          description: "Cannot update FAQ: missing FAQ ID.",
          variant: "destructive"
        });
        return;
      }
      updateMutation.mutate(formData);
    }
  };

  const handleInputChange = (field: keyof FAQ, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {mode === 'create' ? 'Add New FAQ' : 'Edit FAQ'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' ? 'Fill out the form to add a new FAQ entry.' : 'Edit the fields and save to update this FAQ.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Category</label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Question *</label>
            <Input
              value={formData.question}
              onChange={(e) => handleInputChange('question', e.target.value)}
              placeholder="Enter the question..."
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Answer *</label>
            <Textarea
              value={formData.answer}
              onChange={(e) => handleInputChange('answer', e.target.value)}
              placeholder="Enter the answer..."
              rows={6}
              required
            />
          </div>
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  {mode === 'create' ? 'Creating...' : 'Updating...'}
                </>
              ) : (
                <>
                  <i className="fas fa-save mr-2"></i>
                  {mode === 'create' ? 'Create FAQ' : 'Update FAQ'}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 