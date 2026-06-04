// src/hooks/useEditHouse.js

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editHouse } from "../../../services/houseService";
import { reportClientError } from "../../../utils/reportClientError";

export default function useEditHouse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ houseId, houseData }) => editHouse(houseId, houseData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["get-house", variables.houseId]);
    },
    onError: (error) => {
      reportClientError(
        "useEditHouse - Mutation error:",
        error.response?.data || error.message,
      );
    },
  });
}
