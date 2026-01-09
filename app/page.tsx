import { redirect } from "next/navigation";
import Login from "@/components/login/Login";

export default function Home() {
  redirect("/login");

}
