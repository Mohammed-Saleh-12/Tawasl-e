import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import type { TestCategory, TestQuestion, TestResult } from "@shared/schema";

interface TestManagementModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDataChange?: () => void; // Callback for when data changes
}

export default function TestManagementModal({ isOpen, onOpenChange, onDataChange }: TestManagementModalProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [deleteDialog, setDeleteDialog] = useState<{
    type: 'category' | 'question' | 'result';
    id: number;
    name: string;
  } | null>(null);

  // Fetch data
  const { data: categoriesData } = useQuery({
    queryKey: ["/test-categories"],
    queryFn: async () => {
      const data = await apiClient.get("/test-categories");
      return data.categories || [];
    }
  });

  const { data: questionsData } = useQuery({
    queryKey: ["/test-questions"],
    queryFn: async () => {
      const data = await apiClient.get("/test-questions");
      return data || []; // The endpoint returns the array directly
    }
  });

  const { data: resultsData } = useQuery({
    queryKey: ["/test-results"],
    queryFn: async () => {
      const data = await apiClient.get("/test-results");
      return data.results || [];
    }
  });

  const categories = categoriesData || [];
  const questions = questionsData || [];
  const results = resultsData?.results || [];

  // Delete mutations
  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiClient.delete(`/test-categories/${id}`);
    },
    onSuccess: async () => {
      // Invalidate and refetch all test-related queries
      await queryClient.invalidateQueries({ queryKey: ['/test-categories'] });
      await queryClient.invalidateQueries({ queryKey: ['/test-questions'], exact: false });
      await queryClient.invalidateQueries({ queryKey: ['/test-results'] });
      
      // Force refetch to ensure immediate update
      await queryClient.refetchQueries({ queryKey: ['/test-categories'] });
      await queryClient.refetchQueries({ queryKey: ['/test-questions'], exact: false });
      
      // Trigger callback to notify parent component
      onDataChange?.();
      
      toast({
        title: "Success",
        description: "Test category deleted successfully!",
      });
      setDeleteDialog(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete test category. Please try again.",
        variant: "destructive"
      });
    }
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiClient.delete(`/test-questions/${id}`);
    },
    onSuccess: async () => {
      // Invalidate and refetch all test-related queries
      await queryClient.invalidateQueries({ queryKey: ['/test-questions'], exact: false });
      await queryClient.invalidateQueries({ queryKey: ['/test-categories'] });
      
      // Force refetch to ensure immediate update
      await queryClient.refetchQueries({ queryKey: ['/test-questions'], exact: false });
      await queryClient.refetchQueries({ queryKey: ['/test-categories'] });
      
      // Trigger callback to notify parent component
      onDataChange?.();
      
      toast({
        title: "Success",
        description: "Test question deleted successfully!",
      });
      setDeleteDialog(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete test question. Please try again.",
        variant: "destructive"
      });
    }
  });

  const deleteResultMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiClient.delete(`/test-results/${id}`);
    },
    onSuccess: async () => {
      // Invalidate and refetch test results
      await queryClient.invalidateQueries({ queryKey: ['/test-results'] });
      
      // Force refetch to ensure immediate update
      await queryClient.refetchQueries({ queryKey: ['/test-results'] });
      
      // Also invalidate any other test-related queries that might be cached
      await queryClient.invalidateQueries({ queryKey: ['/api/test-results'] });
      await queryClient.refetchQueries({ queryKey: ['/api/test-results'] });
      
      // Trigger callback to notify parent component
      onDataChange?.();
      
      toast({
        title: "Success",
        description: "Test result deleted successfully!",
      });
      setDeleteDialog(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete test result. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleDelete = () => {
    if (!deleteDialog) return;

    // Immediately trigger callback to notify parent of pending change
    onDataChange?.();

    switch (deleteDialog.type) {
      case 'category':
        deleteCategoryMutation.mutate(deleteDialog.id);
        break;
      case 'question':
        deleteQuestionMutation.mutate(deleteDialog.id);
        break;
      case 'result':
        deleteResultMutation.mutate(deleteDialog.id);
        break;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScorePercentage = (result: TestResult) => {
    return Math.round((result.score / result.totalQuestions) * 100);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const isLoading = deleteCategoryMutation.isPending || deleteQuestionMutation.isPending || deleteResultMutation.isPending;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto !bg-white dark:!bg-zinc-900">
          <DialogHeader>
            <DialogTitle>Test Management</DialogTitle>
          </DialogHeader>

          <div className="space-y-8">
            {/* Test Categories */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Test Categories ({categories.length})</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {categories.map((category: TestCategory) => (
                  <Card key={category.id} className="p-4">
                    <CardContent className="p-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`${category.color} text-white p-2 rounded-full`}>
                            <i className={category.icon}></i>
                          </div>
                          <div>
                            <h4 className="font-semibold">{category.name}</h4>
                            <p className="text-sm text-gray-600">{category.description}</p>
                            <p className="text-xs text-gray-500">{category.duration} min • {questions.filter((q: TestQuestion) => q.categoryId === category.id).length} questions</p>
                          </div>
                        </div>
                        <Button
                          onClick={() => setDeleteDialog({
                            type: 'category',
                            id: category.id,
                            name: category.name
                          })}
                          className="btn-danger btn-sm"
                        >
                          <i className="fas fa-trash mr-1"></i>
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Test Questions */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Test Questions ({questions.length})</h3>
              <div className="space-y-4">
                {questions.map((question: TestQuestion) => {
                  const category = categories.find((c: TestCategory) => c.id === question.categoryId);
                  return (
                    <Card key={question.id} className="p-4">
                      <CardContent className="p-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-sm font-medium text-gray-600">
                                {category?.name || 'Unknown Category'}
                              </span>
                              <span className="text-xs text-gray-500">•</span>
                              <span className="text-xs text-gray-500">
                                Correct: {question.correctAnswer}
                              </span>
                            </div>
                            <p className="text-sm mb-2">{question.question}</p>
                            <div className="text-xs text-gray-500">
                              Options: {question.options.join(', ')}
                            </div>
                          </div>
                          <Button
                            onClick={() => setDeleteDialog({
                              type: 'question',
                              id: question.id,
                              name: question.question.substring(0, 50) + '...'
                            })}
                            className="btn-danger btn-sm ml-4"
                          >
                            <i className="fas fa-trash mr-1"></i>
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Test Results */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Test History ({results.length})</h3>
              <div className="space-y-4">
                {results.map((result: TestResult) => {
                  const category = categories.find((c: TestCategory) => c.id === result.categoryId);
                  const scorePercentage = getScorePercentage(result);
                  return (
                    <Card key={result.id} className="p-4">
                      <CardContent className="p-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`${category?.color || 'bg-gray-500'} text-white p-2 rounded-full`}>
                              <i className={category?.icon || 'fas fa-question'}></i>
                            </div>
                            <div>
                              <h4 className="font-semibold">{category?.name || 'Unknown Test'}</h4>
                              <p className="text-sm text-gray-600">
                                Score: {result.score}/{result.totalQuestions} ({scorePercentage}%)
                              </p>
                              <p className="text-xs text-gray-500">
                                Completed: {formatDate(result.completedAt)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className={`text-lg font-bold ${getScoreColor(scorePercentage)}`}>
                              {scorePercentage}%
                            </div>
                            <Button
                              onClick={() => setDeleteDialog({
                                type: 'result',
                                id: result.id,
                                name: `${category?.name || 'Test'} - ${scorePercentage}%`
                              })}
                              className="btn-danger btn-sm"
                            >
                              <i className="fas fa-trash mr-1"></i>
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={() => onOpenChange(false)} className="btn-secondary">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <AlertDialogContent className="!bg-white dark:!bg-zinc-900">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteDialog?.name}"? This action cannot be undone.
              {deleteDialog?.type === 'category' && ' This will also delete all questions in this category.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoading}
              className="btn-danger"
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 