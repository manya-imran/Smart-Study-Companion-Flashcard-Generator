"use client"
import { SignUp } from "@clerk/nextjs";
import { AppBar, Button, Toolbar, Typography, Box } from "@mui/material";
import { Container } from "@mui/material";
import Link from "next/link";

//server-side code
export  default function SignUpPage() {
    return(
        <Container maxWidth="100vw">
            <AppBar position="static" sx={{backgroundColor: '#3f51b5'}}>
                <Toolbar>
                    <Typography variant="h6"
                    sx={{
                        flexGrow: 1,
                    }}>
                        Flashcard Gen 
                    </Typography>
                    <Button color="inherit">
                        <Link href="/sign-in" passHref>
                            Sign In
                        </Link>
                    </Button>
                    <Button color="inherit">
                        <Link href="/sign-up" passHref>
                            Sign Up
                        </Link>
                    </Button>
                </Toolbar>
            </AppBar>
            <Box 
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
            >
                <Typography variant="h4">
                    Sign Up
                    <SignUp/>
                </Typography>

            </Box>
        </Container>
    )
}