import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ForumsTopicsService, ForumsPostsService } from "@/api";
import { CreateTopicDto } from "@/api/models/CreateTopicDto";
import { CreatePostParamDto } from "@/api/models/CreatePostParamDto";

export function useCreateTopicMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTopicDto) => {
      return ForumsTopicsService.topicsControllerCreate(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forums", "topics"] });
    },
  });
}

export function useCreatePostMutation(topicId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostParamDto) => {
      return ForumsPostsService.postsControllerCreate(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forum", "posts", topicId] });
      queryClient.invalidateQueries({ queryKey: ["forum", "topic", topicId] }); // Thread stats might update
    },
  });
}
