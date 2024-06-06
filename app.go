package main

import (
	"bytes"
	"context"
	_ "embed"
	"fmt"
	gosxnotifier "github.com/deckarep/gosx-notifier"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"net"
	"os/exec"
	"regexp"
	"strconv"
	"strings"
	"time"
)

type App struct {
	ctx context.Context
}

type Response struct {
	Data   interface{}
	Status bool
	Error  string
}

func NewApp() *App {
	return &App{}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) shutdown(ctx context.Context) {
}

func (a *App) GoSelectFolderDialog() Response {
	selection, err := runtime.OpenDirectoryDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Select Folder",
	})

	if err != nil {
		return Response{
			Status: false,
			Error:  err.Error(),
		}
	}

	return Response{
		Status: true,
		Data: map[string]string{
			"Directory": selection,
		},
	}
}

func (a *App) GoCheckIsStartProject(directories []string) Response {
	var response []map[string]string

	cmd := exec.Command("bash", "-c", "ps aux | grep php")

	output, err := cmd.Output()
	if err != nil {
		return Response{Status: false, Error: err.Error()}
	}

	lines := strings.Split(string(output), "\n")

	for _, directory := range directories {

		isExist, inx := inLine(directory, lines)

		if isExist {
			portRegex := regexp.MustCompile(`-S localhost:(\d+) -t ([^\s]+)`)
			matches := portRegex.FindStringSubmatch(lines[inx])

			lineFields := strings.Fields(lines[inx])

			response = append(response, map[string]string{
				"Port":      matches[1],
				"Directory": matches[2],
				"Pid":       lineFields[1],
			})
		}
	}

	fmt.Println(response)

	return Response{
		Status: true,
		Data:   response,
	}
}

func (a *App) GoStartProject(dir string, version string) Response {
	startPort := 8000
	endPort := 9000

	var port int

	for p := startPort; p <= endPort; p++ {
		if isPortOpen(p) {
			port = p
			break
		}
	}

	cmd := exec.Command(version+"/php", "-S", "localhost:"+strconv.Itoa(port), "-t", dir)

	var outBuffer, errBuffer bytes.Buffer
	cmd.Stdout = &outBuffer
	cmd.Stderr = &errBuffer

	err := cmd.Start()
	if err != nil {
		return Response{
			Status: false,
			Error:  err.Error(),
		}
	}

	for {
		if strings.Contains(outBuffer.String(), "started") || strings.Contains(errBuffer.String(), "started") {
			fmt.Println("Komut başarıyla çalıştı!")
			break
		}

		if strings.Contains(outBuffer.String(), "does not exist.") || strings.Contains(errBuffer.String(), "does not exist.") {
			fmt.Println("Directory boş!")
			break
		}

		time.Sleep(2 * time.Second)
	}

	return Response{
		Status: true,
		Data: map[string]interface{}{
			"Pid": cmd.Process.Pid,
		},
	}

}

func (a *App) GoStopProject(pid string) Response {
	cmd := exec.Command("kill", pid)

	cmd.Stdout = nil
	cmd.Stderr = nil

	err := cmd.Start()
	if err != nil {
		return Response{
			Status: false,
			Error:  err.Error(),
		}
	}

	return Response{
		Status: true,
	}

}

func (a *App) GoOpenWithPhpStorm(directory string, projectType string) Response {
	if projectType == "symfony" || projectType == "laravel" {
		directory = strings.Replace(directory, "public", "", 1)
	}

	cmd := exec.Command("open", "-a", "/Applications/PhpStorm.app", directory)

	cmd.Stdout = nil
	cmd.Stderr = nil

	err := cmd.Start()
	if err != nil {
		return Response{
			Status: false,
			Error:  err.Error(),
		}
	}

	return Response{
		Status: true,
	}

}

func (a *App) GoSendNotification(title string, message string) Response {
	note := gosxnotifier.NewNotification(message)
	note.Title = title
	note.Sender = "com.apple.Terminal"
	note.Sound = gosxnotifier.Default

	err := note.Push()

	if err != nil {
		return Response{
			Status: false,
		}
	}

	return Response{
		Status: true,
	}
}

func isPortOpen(port int) bool {
	host := "localhost"
	address := fmt.Sprintf("%s:%d", host, port)
	conn, err := net.Dial("tcp", address)
	if err != nil {
		return true
	}
	defer conn.Close()

	return false
}

func inLine(directory string, lines []string) (bool, int) {
	for k, line := range lines {
		if strings.Contains(line, directory) {
			return true, k
		}
	}
	return false, -1
}
