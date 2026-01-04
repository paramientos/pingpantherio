package main

import (
	"fmt"
	"log"
	"os"
	"os/signal"
	"runtime"
	"syscall"
	"time"
)

func main() {
	fmt.Printf("PingPanther Agent v0.1.0 starting on %s/%s\n", runtime.GOOS, runtime.GOARCH)

	// In a real scenario, we'd load config from a file or env
	const serverURL = "http://localhost:8000"
	const interval = 60 * time.Second

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)

	ticker := time.NewTicker(interval)
	defer ticker.Stop()

	fmt.Println("Agent is monitoring...")

	go func() {
		for {
			select {
			case <-ticker.C:
				runChecks(serverURL)
			case <-stop:
				fmt.Println("Shutting down agent...")
				return
			}
		}
	}()

	<-stop
}

func runChecks(url string) {
	// 1. Collect system metrics (CPU, RAM, Disk)
	// 2. Collect DLP event (File access, etc.)
	// 3. Collect UAEBA data (Activity, apps)
	// 4. Send to server
	log.Printf("Heartbeat sent to %s\n", url)
}
