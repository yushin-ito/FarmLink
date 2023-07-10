import { useMutation } from "react-query";
import { supabase } from "../../../supabase";
import { Rental, UseMutationResult } from "../../../types/db";
import { PostgrestError } from "@supabase/supabase-js";
import { decode } from "base64-arraybuffer";

export type PostRentalResponse = Awaited<ReturnType<typeof postRental>>;
export type DeleteRentalResponse = Awaited<ReturnType<typeof deleteRental>>;
export type SearchRentalsResponse = Awaited<ReturnType<typeof searchRentals>>;

const postRental = async ({
  base64,
  rental,
}: {
  base64: string[];
  rental: Rental["Insert"];
}) => {
  const filePath = `rental/${Math.random()}.png`;
  const imageUrls: string[] = [];
  await Promise.all(
    base64.map(async (item) => {
      const { error } = await supabase.storage
        .from("image")
        .upload(filePath, decode(item), {
          contentType: "image",
          upsert: true,
        });
      if (error) {
        throw error;
      }
      const { data } = supabase.storage.from("image").getPublicUrl(filePath);
      imageUrls.push(data.publicUrl);
    })
  );
  const { data, error } = await supabase
    .from("rental")
    .upsert({ ...rental, imageUrls })
    .select();
  if (error) {
    throw error;
  }
  return data;
};

const deleteRental = async (rentalId: number) => {
  const { data, error } = await supabase
    .from("rental")
    .delete()
    .eq("rentalId", rentalId);
  if (error) {
    throw error;
  }
  return data;
};

const searchRentals = async (text: string) => {
  const { data, error } = await supabase
    .from("rental")
    .select()
    .ilike("rentalName", `%${text}%`);
  if (error) {
    throw error;
  }
  return data;
};

export const usePostRental = ({
  onSuccess,
  onError,
}: UseMutationResult<PostRentalResponse, PostgrestError>) =>
  useMutation({
    mutationFn: postRental,
    onSuccess,
    onError,
  });

export const useDeleteRental = ({
  onSuccess,
  onError,
}: UseMutationResult<DeleteRentalResponse, PostgrestError>) =>
  useMutation({
    mutationFn: deleteRental,
    onSuccess,
    onError,
  });

export const useSearchRentals = ({
  onSuccess,
  onError,
}: UseMutationResult<SearchRentalsResponse, PostgrestError>) =>
  useMutation({
    mutationFn: searchRentals,
    onSuccess,
    onError,
  });
