package main

import (
	"embed"
	wailsconfigstore "github.com/AndreiTelteu/wails-configstore"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/mac"
)

//go:embed all:frontend/dist
var assets embed.FS

//go:embed frontend/src/assets/images/icon.png
var icon []byte

func main() {
	app := NewApp()

	configStore, err := wailsconfigstore.NewConfigStore("PHP Navigator")
	if err != nil {
		panic("could not initialize the config store")
	}

	err = wails.Run(&options.App{
		Title:  "PHP Navigator",
		Width:  1024,
		Height: 700,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		Mac: &mac.Options{
			TitleBar: &mac.TitleBar{
				TitlebarAppearsTransparent: true,
			},
			About: &mac.AboutInfo{
				Title:   "PHP Navigator",
				Message: "PHP Navigator allows you to quickly initiate your projects, running them with your preferred PHP version. Easily switch between various projects, add your favorite ones to the home screen for swift access. Discover PHP Navigator with and focus on streamlined development! \n \n Furkan DURA © 2024",
				Icon:    icon,
			},
		},
		BackgroundColour: &options.RGBA{R: 29, G: 35, B: 42, A: 1},
		OnStartup:        app.startup,
		OnShutdown:       app.shutdown,
		Bind: []interface{}{
			app,
			configStore,
		},
	})

	if err != nil {
		panic(err)
	}
}
