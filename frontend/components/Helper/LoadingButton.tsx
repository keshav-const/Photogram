// import React from "react";
// import { Button,ButtonProps } from "../ui/button";
// import { Loader } from "lucide-react";

// interface Props extends ButtonProps {
//  isLoading:boolean;
//  children:React.ReactNode;
// }
// const LoadingButton=({isLoading,children,...props}:Props)=>{
//     return <Button disabled={isLoading} {...props}>
//         {isLoading? <Loader className="animate-spin mr-2"/>:null}
//         {children}
//     </Button>
// };
// export default LoadingButton;
import React from "react";
import { Button } from "../ui/button"; // Import Button from your UI components
import { Loader } from "lucide-react"; // Import the Loader icon

interface Props extends React.ComponentProps<typeof Button> {
  isLoading: boolean;
  children: React.ReactNode;
}

const LoadingButton = ({ isLoading, children, ...props }: Props) => {
  return (
    <Button disabled={isLoading} {...props}>
      {isLoading ? <Loader className="animate-spin mr-2" /> : null}
      {children}
    </Button>
  );
};

export default LoadingButton;
