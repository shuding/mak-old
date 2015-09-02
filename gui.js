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
        // Bind change event
        $scope.$watch('editor.context', function (newContext) {
            $scope.editor.compiled = $sce.trustAsHtml(mak.marked(newContext));
        });
        $scope.editor.context = '# Mak\n\nA minimal Markdown editor on the web.\n\n---\n\n```js\nconsole.log("hello"); /* code highlighting */\n```\n\nLaTeX expression: $x=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}$.\n\n---\n\n[GitHub](https://github.com/quietshu/mak), MIT licensed.\n\n<3\n';

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
        $scope.preview.styleElement.href = './theme/' + ($scope.preview.theme || 'default') + '.css';
        $scope.preview.codeStyleElement.href = './node_modules/highlight.js/styles/' + ($scope.preview.codeTheme || 'default') + '.css';
        $scope.preview.katexStyleElement.href = './bower_components/katex/dist/katex.min.css';
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
