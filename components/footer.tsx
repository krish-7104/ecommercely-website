import { Github, Linkedin, Mail } from "lucide-react";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <section className="bg-white shadow-md border py-4 font-medium flex flex-col md:flex-row justify-between px-10 items-center">
      <Link href={"https://krishjotaniya.netlify.app"} target="_blank">
        Developed By Krish Jotaniya
      </Link>
      <div className="flex justify-evenly items-center w-[30%] md:w-[12%] mt-2 md:mt-0">
        <Link href={"https://github.com/krish-7104/"} target="_blank">
          <Github size={20} />
        </Link>
        <Link
          href={"https://www.linkedin.com/in/krishjotaniya/"}
          target="_blank"
        >
          <Linkedin size={20} />
        </Link>
        <Link href={"mailto:krishjotaniya71@gmail.com"} target="_blank">
          <Mail size={20} />
        </Link>
      </div>
    </section>
  );
};

export default Footer;
