"use client";
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { AppBar, Box, Button, Toolbar, Typography, Container, Grid } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter()
  const handleLaunch = () => {
      router.push('/generate') 
  }
  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_session', {
      method: 'POST',
      headers: {
        origin: 'http://localhost:3000',
      }
    },

   )

    const checkoutSessionJson = await checkoutSession.json()
    if (checkoutSession.statusCode === 500) {
      console.error(checkoutSession.message)
      return
    }

    const stripe = await getStripe()
    const {error} = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id
    })

    if (error) {
      console.warn(error.message)
    }
  }
    
  return (
    <Container maxWidth="100vw">
      <Head>
        <title>Flashcards Generator</title>
        <meta name="description" content="Create flashcards upon receiving your text"/>
      </Head>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>Flashcard Generator</Typography>
          <SignedOut>
            <Button color="inherit"href="/sign-in">Sign In</Button>
            <Button color="inherit" href="/sign-up">Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>
      <Box sx={{ textAlign: "center", my: 4 }}>
        <Typography variant="h2">Welcome to Flashcard Gen</Typography>
        <Typography variant="h5">
          Generate Smart Flashcards with our GenAI-powered Smart Solution
        </Typography>
        <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleLaunch}>
          Let's Get Started
        </Button>
      </Box>
      <Box sx={{ my: 6 }}>
        <Typography variant="h4" color="primary" sx={{ mt: 2 }} gutterBottom>
          Features
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6"gutterBottom>Smart Study Companion</Typography>
            <Typography>
              Flashcards generator upon custom text
               - flashcards never been easier
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>Smart GenAI Flashcards</Typography>
            <Typography>
              A smart intelligent flashcards generator
               - a smart assistant for studying
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6"gutterBottom>Smart Access Flashcards</Typography>
            <Typography>
              Flashcards generator that makes studying easier
               - accessible from anywhere
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{my:6, textAlign: 'center'}}>
        <Typography variant="h4" gutterBottom>
          Pricing
        </Typography>  
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{
              p:3,
              border: '1px solid',
              borderColor: 'grey.300',
              borderRadius:2,
            }}> 
              <Typography variant="h5" gutterBottom>Basic Plan</Typography>
              <Typography variant="h6" gutterBottom>$5/month</Typography>
              <Typography>
                {' '}
                Basic plan provides access to basic flashcard features and limited storage
              </Typography>
              <Button type="contained" color="primary" sx={{mt:2}}>
                Choose Basic Plan
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
          <Box sx={{
              p:3,
              border: '1px solid',
              borderColor: 'grey.300',
              borderRadius:2,
            }}> 
              <Typography variant="h5" gutterBottom>Premium Plan</Typography>
              <Typography variant="h6" gutterBottom>$15/month</Typography>
              <Typography>
                {' '}
                Premium plan provides access to all flashcard features and unlimited storage
              </Typography>
              <Button type="contained" color="primary" sx={{mt:2}} onClick={handleSubmit}>
                Choose Premium Plan
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
          <Box sx={{
              p:3,
              border: '1px solid',
              borderColor: 'grey.300',
              borderRadius:2,
            }}> 
              <Typography variant="h5" gutterBottom>Yearly Plan</Typography>
              <Typography variant="h6" gutterBottom>$150/year</Typography>
              <Typography>
                {' '}
                Yearly plan provides access to all flashcard features and unlimited storage for an year
              </Typography>
              <Button type="contained" color="primary" sx={{mt:2}} onClick={handleSubmit}>
                Choose Yearly Plan
              </Button>
            </Box>
          </Grid>
        </Grid>      
      </Box>
    </Container>
  );
}
