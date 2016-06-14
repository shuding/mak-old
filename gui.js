var app = angular.module('mak', []);

app.controller('mainEditorCtrl', ['$scope', '$sce', mainEditorCtrl]);
app.directive('previewIframe', previewIframe);

function mainEditorCtrl($scope, $sce) {
    $scope.editor = {
        context:  '',
        compiled: ''
    };

    $scope.preview = {
        styleElement: null,
        codeStyleElement: null,
        katexStyleElement: null,
        theme:        'default',
        codeTheme:    'xcode'
    };

    function init() {
        if (window.location.search == '?0') {
            // Mode 0: hide preview
            var previewEl = document.getElementsByClassName('mak-preview')[0];
            previewEl.style.marginRight = '-100%';
            previewEl.style.padding = 0;
        } else if (window.location.search == '?1') {
            // Mode 1: hide editor
            var editorEl = document.getElementsByClassName('mak-editor')[0];
            editorEl.style.marginLeft = '-100%';
        }
        // Bind change event
        $scope.$watch('editor.context', function (newContext) {
            if (localStorage.setItem)
                localStorage.setItem('mak', newContext);
            $scope.editor.compiled = $sce.trustAsHtml(mak.marked(newContext));
        });
        
        var context = (localStorage.getItem && localStorage.getItem('mak')) || '# Mak\n\nA minimal Markdown editor on the web.\n\nChanges will be saved into browser\'s localStorage.\n\nEditor only: [/?0](/mak/?0). Preview only: [/?1](/mak/?1) and then you can save it as a PDF. \n\n---\n\n```js\nconsole.log("hello"); /* code highlighting */\n```\n\nInline LaTeX expression: $x=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}$.\n\nMath equation: $$X_{k}=\sum_{n=0}^{N}x(n)e^{-i2\pi nk/N}$$\n\n---\n\n[GitHub](https://github.com/quietshu/mak), MIT licensed.\n\n<3\n';
        
        $scope.editor.context = context;

        $scope.preview.styleElement      = document.createElement('link');
        $scope.preview.styleElement.rel  = 'stylesheet';
        $scope.preview.styleElement.type = 'text/css';

        $scope.preview.codeStyleElement = document.createElement('link');
        $scope.preview.codeStyleElement.rel = 'stylesheet';
        $scope.preview.codeStyleElement.type = 'text/css';

        $scope.preview.katexStyleElement = document.createElement('link');
        $scope.preview.katexStyleElement.rel = 'stylesheet';
        $scope.preview.katexStyleElement.type = 'text/css';

        loadTheme();
    }

    function loadTheme() {
        $scope.preview.styleElement.href = 'theme/' + ($scope.preview.theme || 'default') + '.css';
        $scope.preview.codeStyleElement.href = 'node_modules/highlight.js/styles/' + ($scope.preview.codeTheme || 'default') + '.css';
        $scope.preview.katexStyleElement.href = 'bower_components/katex/dist/katex.min.css';
    }

    init();
}

function previewIframe() {
    return {
        restrict: 'A',
        link:     function ($scope, element) {
            var document = element[0].contentDocument || element[0].contentWindow.document;
            document.head.appendChild($scope.preview.styleElement);
            document.head.appendChild($scope.preview.codeStyleElement);
            document.head.appendChild($scope.preview.katexStyleElement);

            $scope.$watch('editor.compiled', function (newCompiled) {
                document.body.innerHTML = newCompiled;
            });
        }
    }
}
