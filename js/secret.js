// Hint: Secret Invasion

var ss = ["",""]
const ssf = [
    x=>{
        ss[0] += x.toLowerCase()
        if (!"secretinvasion".includes(ss[0]) && !"shark".includes(ss[0])) {
            ss[0] = ""
        } else if (ss[0] == "secretinvasion") {
            ss[0] = ""
            addPopup({
                html: `
                    "Secret Invasion"?<br><br>Ok, here code is ${ss[1]}<br><br>
                    <b>The code expires in next nearest hour, and is happening!</b>
                `,
                width: 400,
                height: 150,
                otherStyle: {
                    'font-size': "14px",
                },
            })
        } else if (ss[0] == "shark") {
            ss[0] = ""
            addNotify(`Shark!!1!<br><img style="width: 100%; height: 100%;" src="https://i.guim.co.uk/img/media/67451b4b5c64652f11eca069b85013f8b31a4244/1549_893_5174_3105/master/5174.jpg?width=465&quality=45&auto=format&fit=max&dpr=2&s=df139353776471381634b995733c9ebc">`)
        }
    },
    _=>{
        let t = Math.floor(date/3600000)
        ss[1] = Math.floor(t**(2*(Math.sin(t**3/Math.PI)+1))).toString(36)
    },
    x=>{
        if (x == ss[1]) {
            localStorage.setItem("imr_secret",ss[1])
            window.open("https://mrredshark77.github.io/incremental-mass-rewritten/hidden.html","_self")
            return true
        }
        return false
    },
]